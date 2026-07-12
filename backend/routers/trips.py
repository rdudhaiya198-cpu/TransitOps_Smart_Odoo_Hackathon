from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from supabase import Client
from typing import List, Optional
import io
import csv
from datetime import datetime

from models.schemas import TripCreate, TripResponse
from core.database import get_supabase
from core.security import get_current_user

# ReportLab imports for PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

router = APIRouter(prefix="/trips", tags=["trips"])

@router.get("/", response_model=List[TripResponse])
def get_trips(
    status: Optional[str] = Query(None),
    driver_id: Optional[str] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    query = supabase.table("trips").select("*")
    if status:
        query = query.eq("status", status)
    if driver_id:
        query = query.eq("driver_id", driver_id)
    
    res = query.execute()
    return res.data

@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(
    trip: TripCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    # 1. Fetch vehicle details to validate status & capacity
    vehicle_res = supabase.table("vehicles").select("*").eq("id", trip.vehicle_id).execute()
    if not vehicle_res.data:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle = vehicle_res.data[0]

    # 2. Fetch driver details to validate status
    driver_res = supabase.table("drivers").select("*").eq("id", trip.driver_id).execute()
    if not driver_res.data:
        raise HTTPException(status_code=404, detail="Driver not found")
    driver = driver_res.data[0]

    # 3. Validations
    if trip.cargo_weight > float(vehicle["max_load_capacity"]):
        raise HTTPException(
            status_code=400, 
            detail=f"Cargo weight ({trip.cargo_weight} kg) exceeds vehicle max load capacity ({vehicle['max_load_capacity']} kg)"
        )
    
    if vehicle["status"] in ["In Shop", "Retired"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot assign vehicle because it is currently '{vehicle['status']}'"
        )
        
    if driver["status"] == "Suspended":
        raise HTTPException(
            status_code=400, 
            detail="Cannot assign driver because their license is currently Suspended"
        )

    # 4. Insert trip
    try:
        trip_data = trip.model_dump()
        res = supabase.table("trips").insert(trip_data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{trip_id}/dispatch", response_model=TripResponse)
def dispatch_trip(
    trip_id: str,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    # Fetch trip
    trip_res = supabase.table("trips").select("*").eq("id", trip_id).execute()
    if not trip_res.data:
        raise HTTPException(status_code=404, detail="Trip not found")
    trip = trip_res.data[0]

    if trip["status"] != "Scheduled":
        raise HTTPException(status_code=400, detail=f"Only Scheduled trips can be dispatched. Current status: {trip['status']}")

    # Check vehicle and driver availability
    vehicle_res = supabase.table("vehicles").select("status").eq("id", trip["vehicle_id"]).execute()
    if not vehicle_res.data:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle_status = vehicle_res.data[0]["status"]

    driver_res = supabase.table("drivers").select("status").eq("id", trip["driver_id"]).execute()
    if not driver_res.data:
        raise HTTPException(status_code=404, detail="Driver not found")
    driver_status = driver_res.data[0]["status"]

    if vehicle_status != "Available":
        raise HTTPException(status_code=400, detail=f"Vehicle is not Available. Current status: {vehicle_status}")
    if driver_status != "Available":
        raise HTTPException(status_code=400, detail=f"Driver is not Available. Current status: {driver_status}")

    # Start database updates
    try:
        # Update vehicle status to On Trip
        supabase.table("vehicles").update({"status": "On Trip"}).eq("id", trip["vehicle_id"]).execute()
        
        # Update driver status to On Trip
        supabase.table("drivers").update({"status": "On Trip"}).eq("id", trip["driver_id"]).execute()

        # Update trip status to Dispatched and set dispatch_time
        res = supabase.table("trips").update({
            "status": "Dispatched",
            "dispatch_time": datetime.utcnow().isoformat()
        }).eq("id", trip_id).execute()

        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{trip_id}/complete", response_model=TripResponse)
def complete_trip(
    trip_id: str,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    # Fetch trip
    trip_res = supabase.table("trips").select("*").eq("id", trip_id).execute()
    if not trip_res.data:
        raise HTTPException(status_code=404, detail="Trip not found")
    trip = trip_res.data[0]

    if trip["status"] != "Dispatched":
        raise HTTPException(status_code=400, detail=f"Only Dispatched trips can be completed. Current status: {trip['status']}")

    try:
        # Restore vehicle and driver status back to Available
        supabase.table("vehicles").update({"status": "Available"}).eq("id", trip["vehicle_id"]).execute()
        supabase.table("drivers").update({"status": "Available"}).eq("id", trip["driver_id"]).execute()

        # Update trip status to Completed and set completion_time
        res = supabase.table("trips").update({
            "status": "Completed",
            "completion_time": datetime.utcnow().isoformat()
        }).eq("id", trip_id).execute()

        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{trip_id}/cancel", response_model=TripResponse)
def cancel_trip(
    trip_id: str,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    # Fetch trip
    trip_res = supabase.table("trips").select("*").eq("id", trip_id).execute()
    if not trip_res.data:
        raise HTTPException(status_code=404, detail="Trip not found")
    trip = trip_res.data[0]

    if trip["status"] in ["Completed", "Cancelled"]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel a trip that is already {trip['status']}")

    try:
        # If the trip was currently dispatched, free the vehicle and driver
        if trip["status"] == "Dispatched":
            supabase.table("vehicles").update({"status": "Available"}).eq("id", trip["vehicle_id"]).execute()
            supabase.table("drivers").update({"status": "Available"}).eq("id", trip["driver_id"]).execute()

        # Update trip status to Cancelled
        res = supabase.table("trips").update({
            "status": "Cancelled"
        }).eq("id", trip_id).execute()

        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/export/csv")
def export_trips_csv(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        res = supabase.table("trips").select("*").execute()
        trips = res.data

        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(["ID", "Vehicle ID", "Driver ID", "Cargo Weight (kg)", "Status", "Start Location", "Destination", "Dispatch Time", "Completion Time", "Created At"])
        
        for trip in trips:
            writer.writerow([
                trip.get("id"),
                trip.get("vehicle_id"),
                trip.get("driver_id"),
                trip.get("cargo_weight"),
                trip.get("status"),
                trip.get("start_location"),
                trip.get("destination"),
                trip.get("dispatch_time"),
                trip.get("completion_time"),
                trip.get("created_at")
            ])
        
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=trips.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/export/pdf")
def export_trips_pdf(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        res = supabase.table("trips").select("*").execute()
        trips = res.data

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#1A365D"),
            spaceAfter=15
        )
        
        # Title
        story.append(Paragraph("TransitOps - Trips Log", title_style))
        story.append(Spacer(1, 10))

        # Table data
        data = [["ID (Short)", "Vehicle ID (Short)", "Driver ID (Short)", "Cargo (kg)", "Status", "Route"]]
        for trip in trips:
            tid = trip.get("id", "")[:8]
            vid = trip.get("vehicle_id", "")[:8]
            did = trip.get("driver_id", "")[:8]
            route = f"{trip.get('start_location', '')} -> {trip.get('destination', '')}"
            data.append([
                tid,
                vid,
                did,
                str(trip.get("cargo_weight", 0)),
                trip.get("status", ""),
                route
            ])

        table = Table(data, colWidths=[60, 90, 90, 60, 70, 170])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1A365D")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#F7FAFC")),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#EDF2F7")]),
            ('FONTSIZE', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        
        story.append(table)
        doc.build(story)
        
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=trips.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

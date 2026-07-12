from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from supabase import Client
from typing import List, Optional
import io
import csv
from datetime import date

from models.schemas import ExpenseCreate, ExpenseResponse
from core.database import get_supabase
from core.security import get_current_user

# ReportLab imports for PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    vehicle_id: Optional[str] = Query(None),
    driver_id: Optional[str] = Query(None),
    trip_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    query = supabase.table("expenses").select("*")
    if vehicle_id:
        query = query.eq("vehicle_id", vehicle_id)
    if driver_id:
        query = query.eq("driver_id", driver_id)
    if trip_id:
        query = query.eq("trip_id", trip_id)
    if category:
        query = query.eq("category", category)
        
    res = query.execute()
    return res.data

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def record_expense(
    expense: ExpenseCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    # 1. Validation: vehicle if provided
    if expense.vehicle_id:
        vehicle_res = supabase.table("vehicles").select("id").eq("id", expense.vehicle_id).execute()
        if not vehicle_res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")

    # 2. Validation: driver if provided
    if expense.driver_id:
        driver_res = supabase.table("drivers").select("id").eq("id", expense.driver_id).execute()
        if not driver_res.data:
            raise HTTPException(status_code=404, detail="Driver not found")

    # 3. Validation: trip if provided
    if expense.trip_id:
        trip_res = supabase.table("trips").select("id").eq("id", expense.trip_id).execute()
        if not trip_res.data:
            raise HTTPException(status_code=404, detail="Trip not found")

    # 4. Insert expense
    try:
        exp_data = expense.model_dump()
        exp_data["date"] = str(exp_data["date"])
        
        res = supabase.table("expenses").insert(exp_data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/export/csv")
def export_expenses_csv(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        res = supabase.table("expenses").select("*").execute()
        expenses = res.data

        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(["ID", "Vehicle ID", "Driver ID", "Trip ID", "Amount ($)", "Category", "Description", "Date", "Created At"])
        
        for exp in expenses:
            writer.writerow([
                exp.get("id"),
                exp.get("vehicle_id"),
                exp.get("driver_id"),
                exp.get("trip_id"),
                exp.get("amount"),
                exp.get("category"),
                exp.get("description"),
                exp.get("date"),
                exp.get("created_at")
            ])
            
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=expenses.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/export/pdf")
def export_expenses_pdf(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        res = supabase.table("expenses").select("*").execute()
        expenses = res.data

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
            textColor=colors.HexColor("#2C5282"),
            spaceAfter=15
        )
        
        # Title
        story.append(Paragraph("TransitOps - Expenses Log", title_style))
        story.append(Spacer(1, 10))

        # Header and Data
        data = [["Date", "Category", "Amount ($)", "Description", "Vehicle ID (Short)", "Driver ID (Short)"]]
        total_amount = 0.0
        for exp in expenses:
            amt = float(exp.get("amount", 0))
            total_amount += amt
            data.append([
                str(exp.get("date", "")),
                exp.get("category", ""),
                f"${amt:,.2f}",
                exp.get("description", "") or "",
                exp.get("vehicle_id", "")[:8] if exp.get("vehicle_id") else "",
                exp.get("driver_id", "")[:8] if exp.get("driver_id") else ""
            ])
        
        # Totals Row
        data.append(["TOTAL", "", f"${total_amount:,.2f}", "", "", ""])

        table = Table(data, colWidths=[70, 90, 80, 160, 70, 70])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#2C5282")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
            ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, colors.HexColor("#F7FAFC")]),
            ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
            ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#EDF2F7")),
            ('FONTSIZE', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        
        story.append(table)
        doc.build(story)
        
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=expenses.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client
from typing import List, Optional
from datetime import datetime, date
from models.schemas import TripCreate, TripResponse
from core.database import get_supabase
from core.security import get_current_user

router = APIRouter(prefix="/trips", tags=["trips"])

@router.get("/", response_model=List[TripResponse])
def get_trips(
    status: Optional[str] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    query = supabase.table("trips").select("*")
    if status:
        query = query.eq("status", status)
    
    res = query.execute()
    return res.data

@router.post("/", response_model=TripResponse)
def create_trip(
    trip: TripCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # 1. Fetch Vehicle and validate
        if trip.vehicle_id:
            vehicle_res = supabase.table("vehicles").select("*").eq("id", trip.vehicle_id).execute()
            if not vehicle_res.data:
                raise HTTPException(status_code=404, detail="Vehicle not found")
            vehicle = vehicle_res.data[0]
            
            # Check vehicle status
            if vehicle["status"] in ["Retired", "In Shop", "In Maintenance"]:
                raise HTTPException(status_code=400, detail=f"Vehicle is not available for dispatch (Status: {vehicle['status']})")
            if vehicle["status"] == "On Trip":
                raise HTTPException(status_code=400, detail="Vehicle is already assigned to an active trip")
                
            # Check cargo weight against vehicle capacity
            if trip.cargo_weight > vehicle["max_load_capacity"]:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Cargo weight ({trip.cargo_weight} kg) exceeds vehicle's maximum load capacity ({vehicle['max_load_capacity']} kg)"
                )
        
        # 2. Fetch Driver and validate
        if trip.driver_id:
            driver_res = supabase.table("drivers").select("*").eq("id", trip.driver_id).execute()
            if not driver_res.data:
                raise HTTPException(status_code=404, detail="Driver not found")
            driver = driver_res.data[0]
            
            # Check driver status
            if driver["status"] == "Suspended":
                raise HTTPException(status_code=400, detail="Driver is suspended and cannot be assigned to trips")
            if driver["status"] == "On Trip":
                raise HTTPException(status_code=400, detail="Driver is already on another active trip")
                
            # Check license expiry
            expiry_str = driver["license_expiry_date"]
            # Expiry can be 'YYYY-MM-DD'
            expiry_date = datetime.strptime(expiry_str, "%Y-%m-%d").date()
            if expiry_date < date.today():
                raise HTTPException(status_code=400, detail="Driver license is expired")
                
        # 3. Create the trip
        data = trip.model_dump()
        res = supabase.table("trips").insert(data).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Could not create trip")
        return res.data[0]
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{trip_id}/dispatch", response_model=TripResponse)
def dispatch_trip(
    trip_id: str,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # Fetch trip
        trip_res = supabase.table("trips").select("*").eq("id", trip_id).execute()
        if not trip_res.data:
            raise HTTPException(status_code=404, detail="Trip not found")
        trip = trip_res.data[0]
        
        if trip["status"] != "Draft":
            raise HTTPException(status_code=400, detail=f"Only Draft trips can be dispatched (Current status: {trip['status']})")
            
        vehicle_id = trip["vehicle_id"]
        driver_id = trip["driver_id"]
        
        if not vehicle_id or not driver_id:
            raise HTTPException(status_code=400, detail="Trip must have an assigned vehicle and driver before dispatching")
            
        # Re-verify vehicle is Available
        vehicle_res = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
        if vehicle_res.data and vehicle_res.data[0]["status"] != "Available":
            raise HTTPException(status_code=400, detail="Vehicle is no longer Available")
            
        # Re-verify driver is Available
        driver_res = supabase.table("drivers").select("*").eq("id", driver_id).execute()
        if driver_res.data and driver_res.data[0]["status"] != "Available":
            raise HTTPException(status_code=400, detail="Driver is no longer Available")
            
        # Update vehicle status to On Trip
        supabase.table("vehicles").update({"status": "On Trip"}).eq("id", vehicle_id).execute()
        
        # Update driver status to On Trip
        supabase.table("drivers").update({"status": "On Trip"}).eq("id", driver_id).execute()
        
        # Update trip status to Dispatched
        res = supabase.table("trips").update({"status": "Dispatched"}).eq("id", trip_id).execute()
        return res.data[0]
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{trip_id}/complete")
def complete_trip(
    trip_id: str,
    final_odometer: Optional[float] = Query(None),
    fuel_consumed: Optional[float] = Query(None),
    fuel_cost: Optional[float] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # Fetch trip
        trip_res = supabase.table("trips").select("*").eq("id", trip_id).execute()
        if not trip_res.data:
            raise HTTPException(status_code=404, detail="Trip not found")
        trip = trip_res.data[0]
        
        if trip["status"] != "Dispatched":
            raise HTTPException(status_code=400, detail=f"Only Dispatched trips can be completed (Current status: {trip['status']})")
            
        vehicle_id = trip["vehicle_id"]
        driver_id = trip["driver_id"]
        
        # Restore vehicle status to Available
        if vehicle_id:
            supabase.table("vehicles").update({"status": "Available"}).eq("id", vehicle_id).execute()
            # Update Odometer if provided
            if final_odometer is not None:
                supabase.table("vehicles").update({"odometer": final_odometer}).eq("id", vehicle_id).execute()
            # If fuel details are provided, log a fuel entry
            if fuel_consumed is not None and fuel_consumed > 0:
                cost = fuel_cost if fuel_cost is not None else 0
                fuel_log = {
                    "vehicle_id": vehicle_id,
                    "liters": fuel_consumed,
                    "cost": cost,
                    "log_date": date.today().isoformat()
                }
                supabase.table("fuel_logs").insert(fuel_log).execute()
                
                # Also log as an expense
                expense_log = {
                    "vehicle_id": vehicle_id,
                    "trip_id": trip_id,
                    "type": "Fuel",
                    "amount": cost,
                    "date": date.today().isoformat(),
                    "notes": f"Fuel consumption log for Trip {trip.get('trip_id')}"
                }
                supabase.table("expenses").insert(expense_log).execute()
                
        # Restore driver status to Available
        if driver_id:
            supabase.table("drivers").update({"status": "Available"}).eq("id", driver_id).execute()
            
        # Update trip status to Completed
        res = supabase.table("trips").update({"status": "Completed"}).eq("id", trip_id).execute()
        return res.data[0]
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{trip_id}/cancel", response_model=TripResponse)
def cancel_trip(
    trip_id: str,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # Fetch trip
        trip_res = supabase.table("trips").select("*").eq("id", trip_id).execute()
        if not trip_res.data:
            raise HTTPException(status_code=404, detail="Trip not found")
        trip = trip_res.data[0]
        
        if trip["status"] not in ["Draft", "Dispatched"]:
            raise HTTPException(status_code=400, detail=f"Cannot cancel a completed or already cancelled trip (Current status: {trip['status']})")
            
        vehicle_id = trip["vehicle_id"]
        driver_id = trip["driver_id"]
        
        # If it was active (dispatched), restore vehicle and driver to Available
        if trip["status"] == "Dispatched":
            if vehicle_id:
                supabase.table("vehicles").update({"status": "Available"}).eq("id", vehicle_id).execute()
            if driver_id:
                supabase.table("drivers").update({"status": "Available"}).eq("id", driver_id).execute()
                
        # Update trip status to Cancelled
        res = supabase.table("trips").update({"status": "Cancelled"}).eq("id", trip_id).execute()
        return res.data[0]
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

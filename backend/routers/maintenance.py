from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client
from typing import List, Optional
from datetime import date

from models.schemas import (
    MaintenanceLogCreate, MaintenanceLogClose, MaintenanceLogResponse,
    FuelLogCreate, FuelLogResponse
)
from core.database import get_supabase
from core.security import get_current_user

router = APIRouter(tags=["maintenance & fuel"])

# --- Maintenance Endpoints ---

@router.get("/maintenance", response_model=List[MaintenanceLogResponse])
def get_maintenance_logs(
    vehicle_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    query = supabase.table("maintenance_logs").select("*")
    if vehicle_id:
        query = query.eq("vehicle_id", vehicle_id)
    if status:
        query = query.eq("status", status)
        
    res = query.execute()
    return res.data

@router.post("/maintenance", response_model=MaintenanceLogResponse, status_code=status.HTTP_211_CREATED)
def log_maintenance(
    log: MaintenanceLogCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    # 1. Verify vehicle exists
    vehicle_res = supabase.table("vehicles").select("*").eq("id", log.vehicle_id).execute()
    if not vehicle_res.data:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle = vehicle_res.data[0]

    # 2. Check if vehicle is already retired
    if vehicle["status"] == "Retired":
        raise HTTPException(status_code=400, detail="Cannot send a Retired vehicle to the shop")

    try:
        # Update vehicle status to 'In Shop'
        supabase.table("vehicles").update({"status": "In Shop"}).eq("id", log.vehicle_id).execute()

        # Create maintenance log entry
        log_data = log.model_dump()
        if not log_data.get("start_date"):
            log_data["start_date"] = str(date.today())
        else:
            log_data["start_date"] = str(log_data["start_date"])

        log_data["status"] = "Open"
        res = supabase.table("maintenance_logs").insert(log_data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/maintenance/{log_id}/close", response_model=MaintenanceLogResponse)
def close_maintenance(
    log_id: str,
    close_info: MaintenanceLogClose,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    # 1. Fetch maintenance log
    log_res = supabase.table("maintenance_logs").select("*").eq("id", log_id).execute()
    if not log_res.data:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    m_log = log_res.data[0]

    if m_log["status"] == "Closed":
        raise HTTPException(status_code=400, detail="Maintenance log is already closed")

    try:
        # Restore vehicle status to 'Available'
        supabase.table("vehicles").update({"status": "Available"}).eq("id", m_log["vehicle_id"]).execute()

        # Update maintenance log status to 'Closed' and set cost & end_date
        update_data = {
            "status": "Closed",
            "end_date": str(close_info.end_date) if close_info.end_date else str(date.today())
        }
        if close_info.cost is not None:
            update_data["cost"] = close_info.cost
        
        res = supabase.table("maintenance_logs").update(update_data).eq("id", log_id).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- Fuel Log Endpoints ---

@router.get("/fuel-logs", response_model=List[FuelLogResponse])
def get_fuel_logs(
    vehicle_id: Optional[str] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    query = supabase.table("fuel_logs").select("*")
    if vehicle_id:
        query = query.eq("vehicle_id", vehicle_id)
        
    res = query.execute()
    return res.data

@router.post("/fuel-logs", response_model=FuelLogResponse, status_code=status.HTTP_211_CREATED)
def record_fuel_log(
    fuel: FuelLogCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    # 1. Verify vehicle exists
    vehicle_res = supabase.table("vehicles").select("*").eq("id", fuel.vehicle_id).execute()
    if not vehicle_res.data:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    try:
        fuel_data = fuel.model_dump()
        fuel_data["date"] = str(fuel_data["date"])
        
        res = supabase.table("fuel_logs").insert(fuel_data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

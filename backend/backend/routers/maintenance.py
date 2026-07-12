from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional
from datetime import datetime, date
from models.schemas import MaintenanceCreate, MaintenanceResponse
from core.database import get_supabase
from core.security import get_current_user

router = APIRouter(prefix="/maintenance", tags=["maintenance"])

@router.get("/", response_model=List[MaintenanceResponse])
def get_maintenance_logs(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    res = supabase.table("maintenance_logs").select("*").execute()
    return res.data

@router.post("/", response_model=MaintenanceResponse)
def create_maintenance_log(
    log: MaintenanceCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # Check if vehicle exists
        vehicle_res = supabase.table("vehicles").select("*").eq("id", log.vehicle_id).execute()
        if not vehicle_res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        vehicle = vehicle_res.data[0]
        
        if vehicle["status"] == "On Trip":
            raise HTTPException(status_code=400, detail="Cannot put vehicle in maintenance while it is on a trip")

        # Create log
        data = log.model_dump()
        if 'start_date' in data:
            data['start_date'] = str(data['start_date'])
        if 'end_date' in data and data['end_date']:
            data['end_date'] = str(data['end_date'])
            
        res = supabase.table("maintenance_logs").insert(data).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Could not create maintenance log")
        
        # Change vehicle status to In Shop
        supabase.table("vehicles").update({"status": "In Shop"}).eq("id", log.vehicle_id).execute()
        
        return res.data[0]
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{log_id}/close", response_model=MaintenanceResponse)
def close_maintenance_log(
    log_id: str,
    cost: Optional[float] = Query(None),
    end_date: Optional[date] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # Fetch log
        log_res = supabase.table("maintenance_logs").select("*").eq("id", log_id).execute()
        if not log_res.data:
            raise HTTPException(status_code=404, detail="Maintenance log not found")
        log = log_res.data[0]
        
        if log["status"] == "Closed":
            raise HTTPException(status_code=400, detail="Maintenance log is already closed")
            
        vehicle_id = log["vehicle_id"]
        close_date = end_date or date.today()
        final_cost = cost if cost is not None else log["cost"]
        
        # Update log
        update_data = {
            "status": "Closed",
            "end_date": str(close_date),
            "cost": final_cost
        }
        res = supabase.table("maintenance_logs").update(update_data).eq("id", log_id).execute()
        
        # Restore vehicle status to Available (unless retired)
        vehicle_res = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
        if vehicle_res.data:
            vehicle = vehicle_res.data[0]
            if vehicle["status"] != "Retired":
                supabase.table("vehicles").update({"status": "Available"}).eq("id", vehicle_id).execute()
                
        # Record maintenance cost as an operational expense
        expense_log = {
            "vehicle_id": vehicle_id,
            "type": "Maintenance",
            "amount": final_cost,
            "date": str(close_date),
            "notes": f"Completed maintenance log of type: {log.get('type')}. Notes: {log.get('notes')}"
        }
        supabase.table("expenses").insert(expense_log).execute()
        
        return res.data[0]
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

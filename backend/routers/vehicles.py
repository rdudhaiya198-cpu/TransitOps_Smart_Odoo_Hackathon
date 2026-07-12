from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional
from models.schemas import VehicleCreate, VehicleResponse
from core.database import get_supabase
from core.security import get_current_user

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.get("/", response_model=List[VehicleResponse])
def get_vehicles(
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    query = supabase.table("vehicles").select("*")
    if status:
        query = query.eq("status", status)
    if type:
        query = query.eq("type", type)
    
    res = query.execute()
    return res.data

@router.post("/", response_model=VehicleResponse)
def create_vehicle(
    vehicle: VehicleCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        res = supabase.table("vehicles").insert(vehicle.model_dump()).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: str,
    vehicle: VehicleCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        res = supabase.table("vehicles").update(vehicle.model_dump()).eq("id", vehicle_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: str,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        res = supabase.table("vehicles").delete().eq("id", vehicle_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        return {"message": "Vehicle deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

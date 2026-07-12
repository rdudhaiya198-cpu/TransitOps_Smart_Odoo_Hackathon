from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional
from models.schemas import DriverCreate, DriverResponse
from core.database import get_supabase
from core.security import get_current_user

router = APIRouter(prefix="/drivers", tags=["drivers"])

@router.get("/", response_model=List[DriverResponse])
def get_drivers(
    status: Optional[str] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    query = supabase.table("drivers").select("*")
    if status:
        query = query.eq("status", status)
    
    res = query.execute()
    return res.data

@router.post("/", response_model=DriverResponse)
def create_driver(
    driver: DriverCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # Pydantic models automatically handle date formatting, but we need to ensure json compatibility
        data = driver.model_dump()
        if 'license_expiry_date' in data:
            data['license_expiry_date'] = str(data['license_expiry_date'])

        res = supabase.table("drivers").insert(data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(
    driver_id: str,
    driver: DriverCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        data = driver.model_dump()
        if 'license_expiry_date' in data:
            data['license_expiry_date'] = str(data['license_expiry_date'])

        res = supabase.table("drivers").update(data).eq("id", driver_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Driver not found")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{driver_id}")
def delete_driver(
    driver_id: str,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        res = supabase.table("drivers").delete().eq("id", driver_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Driver not found")
        return {"message": "Driver deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

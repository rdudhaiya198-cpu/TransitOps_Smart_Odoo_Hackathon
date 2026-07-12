from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional
from models.schemas import VehicleCreate, VehicleResponse
from core.database import get_supabase
from core.security import ADMIN_ROLES, get_current_user, require_role

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

VEHICLE_SORT_FIELDS = {
    "created_at",
    "registration_number",
    "name_model",
    "type",
    "status",
    "odometer",
    "max_load_capacity",
}

@router.get("", response_model=List[VehicleResponse])
def get_vehicles(
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    search: Optional[str] = Query(None, min_length=1, max_length=80),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    supabase: Client = Depends(get_supabase),
    current_user=Depends(get_current_user),
):
    if sort_by not in VEHICLE_SORT_FIELDS:
        raise HTTPException(status_code=400, detail=f"Invalid sort_by. Use one of: {', '.join(sorted(VEHICLE_SORT_FIELDS))}")

    query = supabase.table("vehicles").select("*")
    if status:
        query = query.eq("status", status)
    if type:
        query = query.eq("type", type)
    if search:
        term = search.replace("%", "").replace(",", " ").strip()
        query = query.or_(f"registration_number.ilike.%{term}%,name_model.ilike.%{term}%,type.ilike.%{term}%")

    res = query.order(sort_by, desc=(sort_order == "desc")).range(offset, offset + limit - 1).execute()
    return res.data

@router.post("", response_model=VehicleResponse)
def create_vehicle(
    vehicle: VehicleCreate,
    supabase: Client = Depends(get_supabase),
    current_user=Depends(require_role(list(ADMIN_ROLES))),
):
    try:
        res = supabase.table("vehicles").insert(vehicle.model_dump()).execute()
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: str,
    vehicle: VehicleCreate,
    supabase: Client = Depends(get_supabase),
    current_user=Depends(require_role(list(ADMIN_ROLES))),
):
    try:
        res = supabase.table("vehicles").update(vehicle.model_dump()).eq("id", vehicle_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: str,
    supabase: Client = Depends(get_supabase),
    current_user=Depends(require_role(list(ADMIN_ROLES))),
):
    try:
        res = supabase.table("vehicles").delete().eq("id", vehicle_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        return {"message": "Vehicle deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

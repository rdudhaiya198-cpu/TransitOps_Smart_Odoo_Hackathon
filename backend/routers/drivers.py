from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional
from models.schemas import DriverCreate, DriverResponse
from core.database import get_supabase
from core.security import ADMIN_ROLES, get_current_user, require_role

router = APIRouter(prefix="/drivers", tags=["drivers"])

DRIVER_SORT_FIELDS = {
    "created_at",
    "name",
    "license_number",
    "license_category",
    "license_expiry_date",
    "safety_score",
    "status",
}

@router.get("", response_model=List[DriverResponse])
def get_drivers(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None, min_length=1, max_length=80),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    supabase: Client = Depends(get_supabase),
    current_user=Depends(get_current_user),
):
    if sort_by not in DRIVER_SORT_FIELDS:
        raise HTTPException(status_code=400, detail=f"Invalid sort_by. Use one of: {', '.join(sorted(DRIVER_SORT_FIELDS))}")

    query = supabase.table("drivers").select("*")
    if status:
        query = query.eq("status", status)
    if search:
        term = search.replace("%", "").replace(",", " ").strip()
        query = query.or_(f"name.ilike.%{term}%,license_number.ilike.%{term}%,contact_number.ilike.%{term}%")

    res = query.order(sort_by, desc=(sort_order == "desc")).range(offset, offset + limit - 1).execute()
    return res.data

@router.post("", response_model=DriverResponse)
def create_driver(
    driver: DriverCreate,
    supabase: Client = Depends(get_supabase),
    current_user=Depends(require_role(list(ADMIN_ROLES))),
):
    try:
        data = driver.model_dump(mode="json")
        res = supabase.table("drivers").insert(data).execute()
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(
    driver_id: str,
    driver: DriverCreate,
    supabase: Client = Depends(get_supabase),
    current_user=Depends(require_role(list(ADMIN_ROLES))),
):
    try:
        data = driver.model_dump(mode="json")
        res = supabase.table("drivers").update(data).eq("id", driver_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Driver not found")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{driver_id}")
def delete_driver(
    driver_id: str,
    supabase: Client = Depends(get_supabase),
    current_user=Depends(require_role(list(ADMIN_ROLES))),
):
    try:
        res = supabase.table("drivers").delete().eq("id", driver_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Driver not found")
        return {"message": "Driver deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

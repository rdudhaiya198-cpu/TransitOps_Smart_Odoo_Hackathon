from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from core.database import get_supabase
from models.schemas import User

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)

@router.get("/")
def get_alerts():
    try:
        supabase = get_supabase()
        response = supabase.table("alerts").select("*, vehicles(name_model, registration_number), drivers(name)").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/unread")
def get_unread_alerts():
    try:
        supabase = get_supabase()
        response = supabase.table("alerts").select("*, vehicles(name_model, registration_number), drivers(name)").eq("is_read", False).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{alert_id}/read")
def mark_alert_read(alert_id: str):
    try:
        supabase = get_supabase()
        response = supabase.table("alerts").update({"is_read": True}).eq("id", alert_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Alert not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{alert_id}")
def delete_alert(alert_id: str):
    try:
        supabase = get_supabase()
        response = supabase.table("alerts").delete().eq("id", alert_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Alert not found")
        return {"message": "Alert deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

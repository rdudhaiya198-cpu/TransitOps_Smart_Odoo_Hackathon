from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from models.schemas import DashboardKPIs
from core.database import get_supabase
from core.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/kpis", response_model=DashboardKPIs)
def get_dashboard_kpis(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # 1. Count Active Vehicles (vehicles currently 'On Trip')
        active_vehicles_res = supabase.table("vehicles").select("id").eq("status", "On Trip").execute()
        active_vehicles = len(active_vehicles_res.data) if active_vehicles_res.data else 0

        # 2. Count Vehicles in Maintenance (vehicles currently 'In Shop')
        in_maint_res = supabase.table("vehicles").select("id").eq("status", "In Shop").execute()
        in_maint = len(in_maint_res.data) if in_maint_res.data else 0

        # 3. Count Active Trips (trips currently 'Dispatched')
        active_trips_res = supabase.table("trips").select("id").eq("status", "Dispatched").execute()
        active_trips = len(active_trips_res.data) if active_trips_res.data else 0

        # 4. Fleet Utilization (%)
        # Utilization = (On Trip Vehicles / Total non-Retired Vehicles) * 100
        non_retired_res = supabase.table("vehicles").select("id").neq("status", "Retired").execute()
        total_non_retired = len(non_retired_res.data) if non_retired_res.data else 0

        fleet_util = 0.0
        if total_non_retired > 0:
            fleet_util = round((active_vehicles / total_non_retired) * 100, 2)

        # Sum of: Fuel logs cost + Maintenance logs cost + general Expenses amount
        fuel_res = supabase.table("fuel_logs").select("cost").execute()
        fuel_cost = sum(float(item.get("cost") or 0) for item in fuel_res.data) if fuel_res.data else 0.0

        maint_res = supabase.table("maintenance_logs").select("cost").execute()
        maint_cost = sum(float(item.get("cost") or 0) for item in maint_res.data) if maint_res.data else 0.0

        exp_res = supabase.table("expenses").select("amount").execute()
        exp_cost = sum(float(item.get("amount") or 0) for item in exp_res.data) if exp_res.data else 0.0

        total_costs = round(fuel_cost + maint_cost + exp_cost, 2)

        return DashboardKPIs(
            active_vehicles=active_vehicles,
            vehicles_in_maintenance=in_maint,
            active_trips=active_trips,
            fleet_utilization_percent=fleet_util,
            total_operational_costs=total_costs
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

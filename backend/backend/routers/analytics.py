from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional
from core.database import get_supabase
from core.security import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
def get_dashboard_kpis(
    vehicle_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # Fetch all vehicles
        veh_query = supabase.table("vehicles").select("*")
        if vehicle_type and vehicle_type != "all":
            veh_query = veh_query.eq("type", vehicle_type)
        if status and status != "all":
            # Map status if needed, otherwise filter directly
            veh_query = veh_query.eq("status", status)
        # Note: If there's a region filter, since we don't have region in vehicles table,
        # we can filter dynamically or ignore/mock it. Let's check.
        # Supabase sql schema does not have region, but for hackathon simplicity we can ignore or mock it.
        
        vehicles = veh_query.execute().data
        
        # Fetch all drivers
        drivers = supabase.table("drivers").select("*").execute().data
        
        # Fetch all trips
        trips = supabase.table("trips").select("*").execute().data
        
        total_vehicles = len(vehicles)
        active_vehicles = sum(1 for v in vehicles if v["status"] == "On Trip")
        available_vehicles = sum(1 for v in vehicles if v["status"] == "Available")
        maint_vehicles = sum(1 for v in vehicles if v["status"] in ["In Shop", "In Maintenance"])
        
        active_trips = sum(1 for t in trips if t["status"] == "Dispatched")
        pending_trips = sum(1 for t in trips if t["status"] == "Draft")
        completed_trips = sum(1 for t in trips if t["status"] == "Completed")
        
        drivers_on_duty = sum(1 for d in drivers if d["status"] in ["Available", "On Trip"])
        
        utilization = 0.0
        if total_vehicles > 0:
            utilization = round((active_vehicles / total_vehicles) * 100, 1)
            
        # Get charts data
        # 1. Fleet Status Distribution: ['Available', 'On Trip', 'Maintenance', 'Retired']
        status_counts = {"Available": 0, "On Trip": 0, "Maintenance": 0, "Retired": 0}
        for v in vehicles:
            vstatus = v["status"]
            if vstatus in ["In Shop", "In Maintenance"]:
                status_counts["Maintenance"] += 1
            elif vstatus in status_counts:
                status_counts[vstatus] += 1
                
        # 2. Monthly Trips: count dispatches per month of this year
        # For simplicity, since SQLite created_at might be text, we can parse it
        monthly_trips = [0] * 12
        for t in trips:
            try:
                # expected format: 2026-07-12T...
                created_date = t.get("created_at") or ""
                if created_date:
                    month = int(created_date.split("-")[1])
                    if 1 <= month <= 12:
                        monthly_trips[month - 1] += 1
            except:
                pass
                
        return {
            "metrics": {
                "activeVehicles": {
                    "value": active_vehicles,
                    "footer": f"Total: {total_vehicles} assets",
                    "tone": "success" if active_vehicles > 0 else "info"
                },
                "availableVehicles": {
                    "value": available_vehicles,
                    "footer": "Ready for dispatch",
                    "tone": "info"
                },
                "maintenanceVehicles": {
                    "value": maint_vehicles,
                    "footer": "Scheduled service",
                    "tone": "danger"
                },
                "activeTrips": {
                    "value": active_trips,
                    "footer": "Currently on route",
                    "tone": "info"
                },
                "pendingTrips": {
                    "value": pending_trips,
                    "footer": "Awaiting dispatch",
                    "tone": "warning"
                },
                "driversOnDuty": {
                    "value": drivers_on_duty,
                    "footer": "Ready / Active",
                    "tone": "success"
                },
                "utilization": {
                    "percentage": utilization,
                    "summary": f"{utilization}% vehicles in use, {available_vehicles} available, {maint_vehicles} in shop."
                }
            },
            "charts": {
                "fleetStatusDistribution": {
                    "labels": ["Available", "On Trip", "Maintenance", "Retired"],
                    "values": [status_counts["Available"], status_counts["On Trip"], status_counts["Maintenance"], status_counts["Retired"]],
                    "colors": ["#2ecc71", "#4aa3ff", "#f39c12", "#8f8f8f"]
                },
                "monthlyTrips": {
                    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    "values": monthly_trips,
                    "color": "#f4a259"
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/reports")
def get_reports_and_roi(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        vehicles = supabase.table("vehicles").select("*").execute().data
        trips = supabase.table("trips").select("*").execute().data
        fuel_logs = supabase.table("fuel_logs").select("*").execute().data
        expenses = supabase.table("expenses").select("*").execute().data
        
        # Calculate overall fuel efficiency: completed trip distance / fuel liters
        total_completed_distance = sum(float(t["planned_distance"] or 0) for t in trips if t["status"] == "Completed")
        total_fuel_liters = sum(float(f["liters"] or 0) for f in fuel_logs)
        
        fuel_efficiency = "0.0 km/L"
        if total_fuel_liters > 0:
            fuel_efficiency = f"{round(total_completed_distance / total_fuel_liters, 2)} km/L"
            
        # Overall expenses sum
        total_maintenance_cost = sum(float(e["amount"]) for e in expenses if e["type"] == "Maintenance")
        total_fuel_cost = sum(float(e["amount"]) for e in expenses if e["type"] == "Fuel")
        total_other_cost = sum(float(e["amount"]) for e in expenses if e["type"] not in ["Fuel", "Maintenance"])
        
        total_ops_cost = total_maintenance_cost + total_fuel_cost
        
        # Vehicle ROIs
        vehicle_rois = []
        for veh in vehicles:
            vid = veh["id"]
            acq_cost = float(veh["acquisition_cost"] or 0)
            
            # Maintenance and Fuel for this vehicle
            v_maint = sum(float(e["amount"]) for e in expenses if e["vehicle_id"] == vid and e["type"] == "Maintenance")
            v_fuel = sum(float(e["amount"]) for e in expenses if e["vehicle_id"] == vid and e["type"] == "Fuel")
            
            # Calculate dynamic revenue for completed trips of this vehicle (₹150 per km)
            v_trips = [t for t in trips if t["vehicle_id"] == vid and t["status"] == "Completed"]
            v_distance = sum(float(t["planned_distance"] or 0) for t in v_trips)
            v_revenue = v_distance * 150.0  # ₹150 per km
            
            roi = 0.0
            if acq_cost > 0:
                roi = round(((v_revenue - (v_maint + v_fuel)) / acq_cost) * 100, 1)
                
            vehicle_rois.append({
                "id": vid,
                "name_model": veh["name_model"],
                "registration_number": veh["registration_number"],
                "acquisition_cost": acq_cost,
                "revenue": v_revenue,
                "maintenance_cost": v_maint,
                "fuel_cost": v_fuel,
                "roi_percentage": roi
            })
            
        return {
            "overall": {
                "fuelEfficiency": fuel_efficiency,
                "tripDistance": f"{int(total_completed_distance)} km",
                "revenue": f"Rs. {round((total_completed_distance * 150.0) / 1000000, 2)}M" if total_completed_distance > 0 else "Rs. 0.0M",
                "safetyScore": "94%", # mock average safety score
                "totalOperationalCost": total_ops_cost,
                "totalExpenses": total_ops_cost + total_other_cost
            },
            "vehicle_rois": vehicle_rois
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

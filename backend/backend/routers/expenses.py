from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional
from datetime import date
from models.schemas import ExpenseCreate, ExpenseResponse, FuelLogCreate, FuelLogResponse
from core.database import get_supabase
from core.security import get_current_user

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    res = supabase.table("expenses").select("*").execute()
    return res.data

@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        data = expense.model_dump()
        if 'date' in data:
            data['date'] = str(data['date'])
        res = supabase.table("expenses").insert(data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/fuel", response_model=List[FuelLogResponse])
def get_fuel_logs(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    res = supabase.table("fuel_logs").select("*").execute()
    return res.data

@router.post("/fuel", response_model=FuelLogResponse)
def create_fuel_log(
    fuel: FuelLogCreate,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        data = fuel.model_dump()
        if 'log_date' in data:
            data['log_date'] = str(data['log_date'])
        res = supabase.table("fuel_logs").insert(data).execute()
        
        # Also register this fuel entry as a standard expense record
        expense_log = {
            "vehicle_id": fuel.vehicle_id,
            "type": "Fuel",
            "amount": fuel.cost,
            "date": str(fuel.log_date),
            "notes": f"Fuel refuel: {fuel.liters} liters"
        }
        supabase.table("expenses").insert(expense_log).execute()
        
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vehicle/{vehicle_id}/total")
def get_vehicle_operational_costs(
    vehicle_id: str,
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    try:
        # Check if vehicle exists
        vehicle_res = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
        if not vehicle_res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")
            
        # Fetch expenses
        res = supabase.table("expenses").select("amount, type").eq("vehicle_id", vehicle_id).execute()
        expenses = res.data
        
        fuel_cost = 0.0
        maintenance_cost = 0.0
        other_cost = 0.0
        
        for exp in expenses:
            amount = float(exp.get("amount") or 0)
            etype = exp.get("type")
            if etype == "Fuel":
                fuel_cost += amount
            elif etype == "Maintenance":
                maintenance_cost += amount
            else:
                other_cost += amount
                
        total_operational = fuel_cost + maintenance_cost
        
        return {
            "vehicle_id": vehicle_id,
            "fuel_cost": fuel_cost,
            "maintenance_cost": maintenance_cost,
            "other_cost": other_cost,
            "total_operational_cost": total_operational,
            "total_expenses": total_operational + other_cost
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    role: str = Field(..., description="Fleet Manager, Driver, Safety Officer, Financial Analyst")

class UserLogin(BaseModel):
    email: str
    password: str

# Vehicle Schemas
class VehicleBase(BaseModel):
    registration_number: str
    name_model: str
    type: str
    max_load_capacity: float
    odometer: float = 0
    acquisition_cost: float = 0
    status: str = "Available" # Available, On Trip, In Shop, Retired

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Driver Schemas
class DriverBase(BaseModel):
    user_id: Optional[str] = None
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: str
    safety_score: float = 100
    status: str = "Available" # Available, On Trip, Off Duty, Suspended

class DriverCreate(DriverBase):
    pass

class DriverResponse(DriverBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Trip Schemas
class TripBase(BaseModel):
    trip_id: str
    vehicle_id: Optional[str] = None
    driver_id: Optional[str] = None
    source: str
    destination: str
    cargo_weight: float
    planned_distance: float
    eta: Optional[str] = None
    status: str = "Draft" # Draft, Dispatched, Completed, Cancelled

class TripCreate(TripBase):
    pass

class TripResponse(TripBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Maintenance Schemas
class MaintenanceBase(BaseModel):
    vehicle_id: str
    type: str
    cost: float = 0
    status: str = "Active" # Active, Closed
    start_date: date
    end_date: Optional[date] = None
    notes: Optional[str] = None

class MaintenanceCreate(MaintenanceBase):
    pass

class MaintenanceResponse(MaintenanceBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Fuel Log Schemas
class FuelLogBase(BaseModel):
    vehicle_id: str
    liters: float
    cost: float
    log_date: date

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogResponse(FuelLogBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Expense Schemas
class ExpenseBase(BaseModel):
    vehicle_id: str
    trip_id: Optional[str] = None
    type: str # Toll, Fine, Maintenance, Fuel, Other
    amount: float
    date: date
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


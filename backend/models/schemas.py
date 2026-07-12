from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import date, datetime

UserRole = Literal["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"]
VehicleStatus = Literal["Available", "On Trip", "In Shop", "Retired"]
DriverStatus = Literal["Available", "On Trip", "Off Duty", "Suspended"]

# Auth Schemas
class UserCreate(BaseModel):
    email: str
    password: str = Field(..., min_length=6)
    role: UserRole

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: UserRole

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Vehicle Schemas
class VehicleBase(BaseModel):
    registration_number: str = Field(..., min_length=2, max_length=40)
    name_model: str = Field(..., min_length=2, max_length=120)
    type: str = Field(..., min_length=2, max_length=80)
    max_load_capacity: float = Field(..., gt=0)
    odometer: float = Field(default=0, ge=0)
    acquisition_cost: float = Field(default=0, ge=0)
    status: VehicleStatus = "Available"

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
    name: str = Field(..., min_length=2, max_length=120)
    license_number: str = Field(..., min_length=2, max_length=60)
    license_category: str = Field(..., min_length=2, max_length=80)
    license_expiry_date: date
    contact_number: str = Field(..., min_length=5, max_length=30)
    safety_score: float = Field(default=100, ge=0, le=100)
    status: DriverStatus = "Available"

class DriverCreate(DriverBase):
    pass

class DriverResponse(DriverBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Trip Schemas
class TripBase(BaseModel):
    vehicle_id: str
    driver_id: str
    cargo_weight: float
    status: str = "Scheduled"  # Scheduled, Dispatched, Completed, Cancelled
    start_location: str
    destination: str
    dispatch_time: Optional[datetime] = None
    completion_time: Optional[datetime] = None

class TripCreate(BaseModel):
    vehicle_id: str
    driver_id: str
    cargo_weight: float = Field(..., gt=0)
    start_location: str
    destination: str

class TripResponse(TripBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Maintenance Log Schemas
class MaintenanceLogBase(BaseModel):
    vehicle_id: str
    description: str
    start_date: date
    end_date: Optional[date] = None
    cost: float = 0.0
    status: str = "Open"  # Open, Closed

class MaintenanceLogCreate(BaseModel):
    vehicle_id: str
    description: str
    start_date: Optional[date] = None
    cost: Optional[float] = 0.0

class MaintenanceLogClose(BaseModel):
    end_date: Optional[date] = None
    cost: Optional[float] = 0.0

class MaintenanceLogResponse(MaintenanceLogBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Fuel Log Schemas
class FuelLogBase(BaseModel):
    vehicle_id: str
    liters: float = Field(..., gt=0)
    cost: float = Field(..., ge=0)
    date: date

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogResponse(FuelLogBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Expense Schemas
class ExpenseBase(BaseModel):
    vehicle_id: Optional[str] = None
    driver_id: Optional[str] = None
    trip_id: Optional[str] = None
    amount: float = Field(..., ge=0)
    category: str  # Fuel, Maintenance, Toll, Food, Other
    description: Optional[str] = None
    date: date

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Dashboard KPI Schema
class DashboardKPIs(BaseModel):
    active_vehicles: int
    vehicles_in_maintenance: int
    active_trips: int
    fleet_utilization_percent: float
    total_operational_costs: float


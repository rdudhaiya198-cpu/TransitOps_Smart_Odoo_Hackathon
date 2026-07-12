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

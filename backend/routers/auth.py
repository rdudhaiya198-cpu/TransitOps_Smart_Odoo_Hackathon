from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from models.schemas import LoginResponse, UserCreate, UserLogin
from core.database import get_supabase
from core.security import get_user_role

router = APIRouter(prefix="/auth", tags=["auth"])

def serialize_user(user):
    return {
        "id": user.id,
        "email": user.email,
        "role": get_user_role(user) or "Fleet Manager",
    }

@router.post("/register")
def register(user: UserCreate, supabase: Client = Depends(get_supabase)):
    try:
        res = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {"data": {"role": user.role}},
        })

        return {
            "message": "User registered successfully. Check your email if verification is enabled.",
            "user": serialize_user(res.user),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=LoginResponse)
def login(user: UserLogin, supabase: Client = Depends(get_supabase)):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password,
        })
        if not res.session or not res.session.access_token:
            raise HTTPException(status_code=401, detail="Email verification required or invalid credentials")
        return {"access_token": res.session.access_token, "user": serialize_user(res.user)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid credentials or " + str(e))

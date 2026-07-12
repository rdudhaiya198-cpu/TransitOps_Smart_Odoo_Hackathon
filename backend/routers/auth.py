from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from models.schemas import UserCreate, UserLogin
from core.database import get_supabase

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(user: UserCreate, supabase: Client = Depends(get_supabase)):
    try:
        # Create user in Supabase Auth
        res = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        
        if res.user:
            # Add role in the public.profiles table
            profile_data = {
                "id": res.user.id,
                "email": user.email,
                "role": user.role
            }
            supabase.table("profiles").insert(profile_data).execute()
            
        return {"message": "User registered successfully", "user": res.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(user: UserLogin, supabase: Client = Depends(get_supabase)):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {"access_token": res.session.access_token, "user": res.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid credentials or " + str(e))

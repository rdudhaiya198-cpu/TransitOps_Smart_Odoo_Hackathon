from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import Client
from .database import get_supabase

security = HTTPBearer()
ADMIN_ROLES = {"Fleet Manager"}

def get_user_role(current_user) -> str | None:
    metadata = getattr(current_user, "user_metadata", None) or {}
    app_metadata = getattr(current_user, "app_metadata", None) or {}
    return metadata.get("role") or app_metadata.get("role")

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase),
):
    token = credentials.credentials
    try:
        res = supabase.auth.get_user(token)
        if not res or not res.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return res.user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

def require_role(allowed_roles: list[str]):
    def role_checker(current_user=Depends(get_current_user), supabase: Client = Depends(get_supabase)):
        user_role = get_user_role(current_user)

        if not user_role:
            profile_res = supabase.table("profiles").select("role").eq("id", current_user.id).execute()
            if profile_res.data:
                user_role = profile_res.data[0]["role"]

        if user_role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return current_user

    return role_checker

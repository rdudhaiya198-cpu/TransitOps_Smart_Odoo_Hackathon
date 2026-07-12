from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from .database import get_supabase

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), supabase: Client = Depends(get_supabase)):
    token = credentials.credentials
    try:
        # Verify JWT token with Supabase
        res = supabase.auth.get_user(token)
        if not res or not res.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return res.user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

def require_role(allowed_roles: list[str]):
    def role_checker(current_user = Depends(get_current_user), supabase: Client = Depends(get_supabase)):
        # For a full implementation, we'd check the user's role in the public.profiles table
        # Here we mock it or fetch it:
        profile_res = supabase.table('profiles').select('role').eq('id', current_user.id).execute()
        if not profile_res.data or len(profile_res.data) == 0:
            raise HTTPException(status_code=403, detail="User profile not found")
        
        user_role = profile_res.data[0]['role']
        if user_role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return current_user
    return role_checker

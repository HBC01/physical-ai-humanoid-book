from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import jwt
import uuid
from datetime import datetime, timedelta
from ..core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

# In-memory store for demo (replace with Neon DB in production)
users_db = {}
tokens_db = {}

class SignupRequest(BaseModel):
    email: str
    password: str
    hardware_tier: Optional[str] = "General/PC"
    software_env: Optional[str] = "Ubuntu 22.04"

class SigninRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    hardware_tier: str
    software_env: str

class TokenResponse(BaseModel):
    access_token: str
    user: UserResponse

def create_token(user_id: str) -> str:
    """Create JWT token"""
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm="HS256")

def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, settings.BETTER_AUTH_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@router.post("/signup", response_model=TokenResponse)
async def signup(data: SignupRequest):
    """Register a new user"""
    # Check if user exists
    for user in users_db.values():
        if user["email"] == data.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": data.email,
        "password": data.password,  # In production, hash this!
        "hardware_tier": data.hardware_tier,
        "software_env": data.software_env,
        "created_at": datetime.utcnow().isoformat()
    }
    users_db[user_id] = user

    token = create_token(user_id)
    tokens_db[token] = user_id

    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            email=user["email"],
            hardware_tier=user["hardware_tier"],
            software_env=user["software_env"]
        )
    )

@router.post("/signin", response_model=TokenResponse)
async def signin(data: SigninRequest):
    """Authenticate user"""
    user = None
    for u in users_db.values():
        if u["email"] == data.email and u["password"] == data.password:
            user = u
            break

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user["id"])
    tokens_db[token] = user["id"]

    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            hardware_tier=user["hardware_tier"],
            software_env=user["software_env"]
        )
    )

@router.post("/signout")
async def signout(token: str = Depends(lambda: None)):
    """Sign out user"""
    # In production, invalidate the token
    return {"message": "Signed out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_me(authorization: str = None):
    """Get current user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    user = users_db.get(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user["id"],
        email=user["email"],
        hardware_tier=user["hardware_tier"],
        software_env=user["software_env"]
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    hardware_tier: Optional[str] = None,
    software_env: Optional[str] = None,
    authorization: str = None
):
    """Update user profile"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    user = users_db.get(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if hardware_tier:
        user["hardware_tier"] = hardware_tier
    if software_env:
        user["software_env"] = software_env

    return UserResponse(
        id=user["id"],
        email=user["email"],
        hardware_tier=user["hardware_tier"],
        software_env=user["software_env"]
    )

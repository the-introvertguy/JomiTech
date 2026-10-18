from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_current_user
from backend.app.core.security import verify_password, create_access_token
from backend.app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    name_bn: str
    role: str
    designation: Optional[str] = None
    designation_bn: Optional[str] = None

class UserProfileOut(BaseModel):
    id: str
    email: str
    name: str
    name_bn: str
    role: str
    designation: Optional[str] = None
    designation_bn: Optional[str] = None

    class Config:
        from_attributes = True

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email and Argon2 password hash."""
    user = db.query(User).filter(User.email == req.email, User.is_active == True).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        name=user.name,
        name_bn=user.name_bn,
        role=user.role,
        designation=user.designation,
        designation_bn=user.designation_bn,
    )

@router.get("/me", response_model=UserProfileOut)
def get_current_user_profile(
    current_user: Optional[User] = Depends(get_current_user),
):
    """Retrieve profile and verified role of currently authenticated user."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return current_user

@router.post("/demo-switch/{role}", response_model=TokenResponse)
def demo_switch_role(role: str, db: Session = Depends(get_db)):
    """Developer / Demo mode role switch to issue instant test tokens."""
    user = db.query(User).filter(User.role == role, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No active demo user found with role '{role}'.",
        )

    access_token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        name=user.name,
        name_bn=user.name_bn,
        role=user.role,
        designation=user.designation,
        designation_bn=user.designation_bn,
    )

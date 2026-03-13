from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import (
    get_current_user,
    hash_password,
    require_roles,
    verify_password,
)
from app.core.utils import generate_uuid
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_email(user.email, db)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = User(
        id=generate_uuid(),
        email=user.email,
        password=hash_password(user.password),
        full_name=user.full_name,
        role=user.role or "user",
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login")
async def login_user(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await AuthService.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Revoke old tokens
    await AuthService.revoke_all_user_tokens(user.id, db)

    # Create new tokens
    access_token = AuthService.create_access_token({"sub": user.email})
    refresh_token = AuthService.create_refresh_token({"sub": user.email})

    # Store refresh token
    await AuthService.create_refresh_token_record(user.id, refresh_token, db)

    # Set cookies
    AuthService.set_auth_cookies(response, access_token, refresh_token)

    return {"message": "Login successful"}


@router.post("/refresh")
async def refresh_token(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    payload = AuthService.verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Check if refresh token exists in DB
    token_record = await AuthService.get_refresh_token_record(refresh_token, db)
    if not token_record or token_record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Refresh token expired or revoked")

    user = await get_user_by_email(email, db)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Create new access token
    new_access_token = AuthService.create_access_token({"sub": user.email})

    # Optionally rotate refresh token
    new_refresh_token = AuthService.create_refresh_token({"sub": user.email})
    await AuthService.revoke_refresh_token(refresh_token, db)
    await AuthService.create_refresh_token_record(user.id, new_refresh_token, db)

    AuthService.set_auth_cookies(response, new_access_token, new_refresh_token)

    return {"message": "Token refreshed"}


@router.post("/logout")
async def logout_user(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        await AuthService.revoke_refresh_token(refresh_token, db)

    AuthService.clear_auth_cookies(response)
    return {"message": "Logout successful"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_endpoint(
    current_user: User = Depends(get_current_user)
):
    return current_user


# Endpoint для смены роли пользователя (только для admin)
@router.patch("/users/{user_id}/role", response_model=UserResponse)
async def change_user_role(
    user_id: str,
    new_role: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(["admin"]))
):
    from sqlalchemy.future import select
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = new_role
    await db.commit()
    await db.refresh(user)
    return user



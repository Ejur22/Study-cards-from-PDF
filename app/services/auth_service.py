from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Response
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete

from app.core.config import settings
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.core.security import hash_password, verify_password, get_user_by_email
from app.core.utils import generate_uuid


class AuthService:
    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire, "type": "access"})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def create_refresh_token(data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=7))
        to_encode.update({"exp": expire, "type": "refresh"})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    async def authenticate_user(email: str, password: str, db: AsyncSession):
        user = await get_user_by_email(email, db)
        if not user or not verify_password(password, user.password):
            return None
        return user

    @staticmethod
    async def create_refresh_token_record(user_id: str, token: str, db: AsyncSession):
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        refresh_token = RefreshToken(
            id=generate_uuid(),
            token=token,
            user_id=user_id,
            expires_at=expires_at
        )
        db.add(refresh_token)
        await db.commit()
        return refresh_token

    @staticmethod
    async def revoke_refresh_token(token: str, db: AsyncSession):
        await db.execute(delete(RefreshToken).where(RefreshToken.token == token))
        await db.commit()

    @staticmethod
    async def revoke_all_user_tokens(user_id: str, db: AsyncSession):
        await db.execute(delete(RefreshToken).where(RefreshToken.user_id == user_id))
        await db.commit()

    @staticmethod
    def verify_token(token: str):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            return None

    @staticmethod
    async def get_refresh_token_record(token: str, db: AsyncSession):
        result = await db.execute(select(RefreshToken).where(RefreshToken.token == token))
        return result.scalars().first()

    @staticmethod
    def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
        # На localhost используем secure=False, на production используем secure=True
        is_secure = False  # TODO: change to True in production with HTTPS
        
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=is_secure,  # False для localhost, True для production
            samesite="lax",    # lax для лучшей совместимости, strict может блокировать
            max_age=15 * 60    # 15 minutes
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=is_secure,  # False для localhost, True для production
            samesite="lax",    # lax для лучшей совместимости
            max_age=7 * 24 * 60 * 60  # 7 days
        )

    @staticmethod
    def clear_auth_cookies(response: Response):
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

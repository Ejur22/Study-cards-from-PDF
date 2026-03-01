from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()

# Получить всех пользователей (только для admin)
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(["admin"]))
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

# Получить свою историю (пример: просто вернуть пользователя)
@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(["user", "admin"]))
):
    # Здесь можно добавить возврат истории, сейчас просто профиль
    return current_user

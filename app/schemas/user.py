from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "user"  # 'guest', 'user', 'admin'


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str]
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str

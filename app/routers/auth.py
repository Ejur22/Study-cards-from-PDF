from fastapi import APIRouter
from app.models.user import UserRegister, UserLogin

router = APIRouter(prefix="/auth", tags=["Authentication"])

users_db = {}

@router.post("/register")
def register(user: UserRegister):
    if user.email in users_db:
        return {"error": "User already exists"}
    users_db[user.email] = user.password
    return {"message": "User registered"}

@router.post("/login")
def login(user: UserLogin):
    if users_db.get(user.email) != user.password:
        return {"error": "Invalid credentials"}
    return {"message": "Login successful"}

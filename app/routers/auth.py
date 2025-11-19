from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from typing import Dict
from app.models.user import UserRegister, UserLogin, Token, UserInDB
from app.utils.security import get_password_hash, verify_password, create_access_token, decode_token
from fastapi import Security
from app.models.user import TokenData
from jose import JWTError


router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

#Потом поменяется на базу данных
users_db: Dict[str, UserInDB] = {}

@router.post("/register", response_model=dict)
def register(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    hashed = get_password_hash(user.password)
    users_db[user.email] = UserInDB(email=user.email, hashed_password=hashed)
    return {"message": "User registered"}

@router.post("/login", response_model=Token)
def login(form_data: UserLogin):
    user = users_db.get(form_data.email)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")


    access_token = create_access_token(subject=user.email, expires_delta=timedelta(minutes=60))
    return Token(access_token=access_token)

#Получение текущего пользователя
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


    user = users_db.get(token_data.email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import auth, flashcards, groups
from app.routers import users
from app.models import user, group, flashcard, refresh_token  # Import all models

app = FastAPI(title="SmartCards Backend")


# разрешаем фронтенду на локале
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])
app.include_router(flashcards.router, prefix="/flashcards", tags=["flashcards"])
app.include_router(users.router, tags=["users"])


# Создаём все таблицы при старте
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


#PS C:\Fullstack_project\Study-cards-from-PDF> uvicorn app.main:app --reload
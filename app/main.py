import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.database import engine, Base
from app.routers import auth, flashcards, groups, users, public
from app.models import user, group, flashcard, refresh_token  # Import all models

app = FastAPI(
    title="SmartCards Backend",
    description="API для создания интерактивных карточек из PDF файлов",
    version="1.0.0"
)


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

# Подключаем маршруты (public ПОСЛЕДНИЙ, т.к. содержит catch-all маршрут!)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])
app.include_router(flashcards.router, prefix="/flashcards", tags=["flashcards"])
app.include_router(users.router, tags=["users"])
app.include_router(public.router, tags=["public"])  # ДОЛЖЕН БЫТЬ ПОСЛЕДНИМ! catch-all маршрут /{full_path:path}


# Обработчик основной ошибки 404 в FastAPI
@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc):
    """Обработчик 404 ошибок с правильным HTTP статусом для SEO."""
    return JSONResponse(
        status_code=404,
        content={"detail": "Страница не найдена", "path": str(request.url.path)}
    )


@app.exception_handler(403)
async def forbidden_exception_handler(request: Request, exc):
    """Обработчик 403 ошибок."""
    return JSONResponse(
        status_code=403,
        content={"detail": "Доступ запрещён"}
    )


@app.get("/", tags=["public"])
async def root():
    """Основной endpoint для SEO."""
    return {
        "message": "Добро пожаловать в StudyCards API",
        "version": "1.0.0",
        "docs": "/docs",
        "public_endpoints": [
            "/api/dictionary/word-of-day",
            "/robots.txt",
            "/sitemap.xml"
        ]
    }


# Создаём все таблицы при старте
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


#PS C:\Fullstack_project\Study-cards-from-PDF> uvicorn app.main:app --reload

# python3 -m venv venv
# source venv/bin/activate

# for Linux
# wget -O minio_binary https://dl.min.io/server/minio/release/linux-amd64/minio
# chmod +x minio_binary
# ./minio_binary server minio/data --console-address ":9001"

# if vite: Permission denied
# rm -rf node_modules package-lock.json
# npm install

# ./minio.exe server minio\data --console-address ":9001"  windows
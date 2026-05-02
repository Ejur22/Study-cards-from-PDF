"""
conftest.py - Глобальная конфигурация pytest и фикстуры

Этот файл содержит общие фикстуры для всех тестов:
- Тестовая БД
- Тестовый клиент FastAPI
- Тестовые пользователи
- Очистка состояния между тестами
"""

import asyncio
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.database import Base, get_db
from app.main import app
from app.models import User, Group, Flashcard, RefreshToken
from app.core.security import hash_password
from app.core.utils import generate_uuid
from app.services.auth_service import AuthService
import os
from datetime import datetime, timedelta, timezone

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def test_db():
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    AsyncSessionLocal = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    yield AsyncSessionLocal
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture
async def client(test_db):
    async def override_get_db():
        async with test_db() as session:
            yield session
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
async def test_user(test_db):
    async with test_db() as session:
        user = User(
            id=generate_uuid(),
            email="testuser@example.com",
            password=hash_password("TestPassword123!"),
            full_name="Test User",
            role="user"
        )
        session.add(user)
        await session.commit()
        return user


@pytest.fixture
async def test_admin_user(test_db):
    async with test_db() as session:
        admin = User(
            id=generate_uuid(),
            email="admin@example.com",
            password=hash_password("AdminPassword123!"),
            full_name="Admin User",
            role="admin"
        )
        session.add(admin)
        await session.commit()
        return admin


@pytest.fixture
async def authenticated_client(client, test_user, test_db):
    access_token = AuthService.create_access_token({"sub": test_user.email})
    refresh_token = AuthService.create_refresh_token({"sub": test_user.email})
    
    async with test_db() as session:
        rt = RefreshToken(
            id=generate_uuid(),
            token=refresh_token,
            user_id=test_user.id,
            expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        )
        session.add(rt)
        await session.commit()
    
    client.cookies.set("access_token", access_token)
    client.cookies.set("refresh_token", refresh_token)
    
    return client


@pytest.fixture
async def test_group(test_user, test_db):
    async with test_db() as session:
        group = Group(
            id=generate_uuid(),
            filename="test.pdf",
            file_path="/uploads/test.pdf",
            user_id=test_user.id,
            score=85.5,
            correct_answers='{"correct": 17, "total": 20}'
        )
        session.add(group)
        await session.commit()
        return group


@pytest.fixture
async def test_flashcards(test_group, test_db):
    async with test_db() as session:
        flashcards = [
            Flashcard(
                id=generate_uuid(),
                group_id=test_group.id,
                question="Какой язык программирования используется на backend?",
                options=["Python", "JavaScript", "Go", "Rust"],
                correct_index=0,
            ),
            Flashcard(
                id=generate_uuid(),
                group_id=test_group.id,
                question="Какой фреймворк используется на frontend?",
                options=["React", "Vue", "Angular", "Svelte"],
                correct_index=0,
                explanation="React с TypeScript"
            ),
            Flashcard(
                id=generate_uuid(),
                group_id=test_group.id,
                question="Какое хранилище используется для файлов?",
                options=["MinIO", "S3", "GCS", "Azure"],
                correct_index=0,
                explanation="MinIO для локального хранилища"
            ),
        ]
        session.add_all(flashcards)
        await session.commit()
        return flashcards



def pytest_configure(config):
    config.addinivalue_line("markers", "unit: быстрый unit тест")
    config.addinivalue_line("markers", "integration: интеграционный тест")
    config.addinivalue_line("markers", "e2e: сквозной E2E тест")
    config.addinivalue_line("markers", "slow: медленный тест")
    config.addinivalue_line("markers", "auth: тест аутентификации")
    config.addinivalue_line("markers", "file: тест работы с файлами")
    config.addinivalue_line("markers", "api: тест внешнего API")

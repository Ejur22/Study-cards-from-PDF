import asyncio
from app.core.database import async_session_maker
from app.models.user import User
from app.core.security import hash_password, verify_password, get_user_by_email
from app.core.utils import generate_uuid
from app.services.auth_service import AuthService
from sqlalchemy import select, text

async def check_db():
    """Проверяем что есть в БД"""
    async with async_session_maker() as db:
        # Просто выполняем raw SQL для проверки
        try:
            result = await db.execute(text("SELECT COUNT(*) as count FROM users"))
            count = result.scalar()
            print(f"Users in DB: {count}")
        except Exception as e:
            print(f"Error: {e}")

async def create_test_user():
    """Создаёт тестового пользователя для тестирования"""
    async with async_session_maker() as db:
        # Сначала проверяем что таблица существует
        try:
            result = await db.execute(text("SELECT 1 FROM users LIMIT 1"))
            print("Users table exists")
        except Exception as e:
            print(f"Users table doesn't exist: {e}")
            return
        
        # Проверяем существующих пользователей
        result = await db.execute(text("SELECT email FROM users"))
        users = result.scalars().all()
        print(f"Existing users: {users}")
        
        # Создаём тестового пользователя
        test_user = User(
            id=generate_uuid(),
            email="test@example.com",
            password=hash_password("password123"),
            full_name="Test User",
            role="user"
        )
        db.add(test_user)
        await db.commit()
        print("Test user 'test@example.com' created!")

async def test_authenticate():
    """Тестируем функцию authenticate_user"""
    async with async_session_maker() as db:
        # Проверяем что есть пользователь test@example.com
        user = await AuthService.authenticate_user("test@example.com", "password123", db)
        if user:
            print(f"✓ Authentication successful! User: {user.email}")
        else:
            print("✗ Authentication failed!")
            
        # Проверяем неправильный пароль
        user = await AuthService.authenticate_user("test@example.com", "wrongpassword", db)
        if not user:
            print("✓ Wrong password correctly rejected!")
        else:
            print("✗ Wrong password was accepted!")

async def main():
    print("=" * 60)
    print("1. Проверяем БД:")
    await check_db()
    
    print("\n" + "=" * 60)
    print("2. Создаём тестового пользователя:")
    await create_test_user()
    
    print("\n" + "=" * 60)
    print("3. Тестируем аутентификацию:")
    await test_authenticate()

if __name__ == "__main__":
    asyncio.run(main())

import asyncio
from app.core.database import async_session_maker
from app.core.security import verify_password
from sqlalchemy import text

async def test_login_with_raw_sql():
    """Тестируем логин используя raw SQL queries"""
    async with async_session_maker() as db:
        # Получаем информацию о первом пользователе
        result = await db.execute(text("SELECT id, email, password FROM users LIMIT 1"))
        user = result.first()
        
        if not user:
            print("No users in database!")
            return
        
        user_id, email, password_hash = user
        print(f"User found: {email}")
        print(f"Password hash (bcrypt): {password_hash[:30]}...")
        
        # Пытаемся следующие пароли:
        test_passwords = [
            "password",
            "password123",
            "123456",
            "admin",
            "test",
            "user",
        ]
        
        print("\nTesting password verification:")
        for pwd in test_passwords:
            is_valid = verify_password(pwd, password_hash)
            status = "✓ VALID" if is_valid else "✗ invalid"
            print(f"  {pwd:20s} -> {status}")

if __name__ == "__main__":
    asyncio.run(test_login_with_raw_sql())

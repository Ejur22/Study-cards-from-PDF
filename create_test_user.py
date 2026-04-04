import asyncio
from app.core.database import async_session_maker
from app.models.user import User
from app.core.security import hash_password
from app.core.utils import generate_uuid
from sqlalchemy import text

async def create_fresh_test_user():
    """Создаёт свежего тестового пользователя с известным паролем"""
    async with async_session_maker() as db:
        email = "testuser@test.com"
        password = "Test123!@#"
        
        # Сначала удаляем если существует
        try:
            await db.execute(text(f"DELETE FROM users WHERE email = '{email}'"))
            await db.commit()
            print(f"Deleted existing user: {email}")
        except:
            pass
        
        try:
            # Создаём новый пользователь
            test_user = User()
            test_user.id = generate_uuid()
            test_user.email = email
            test_user.password = hash_password(password)
            test_user.full_name = "Test User"
            test_user.role = "user"
            
            db.add(test_user)
            await db.commit()
            
            print(f"✓ Created fresh test user:")
            print(f"  Email: {email}")
            print(f"  Password: {password}")
            print(f"\nYou can now use these credentials to login!")
        except Exception as e:
            print(f"Error creating user: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(create_fresh_test_user())

import asyncio
from app.core.database import async_session_maker
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.core.utils import generate_uuid
from sqlalchemy import select

async def check_users():
    async with async_session_maker() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()
        print(f"Total users in DB: {len(users)}")
        for user in users:
            print(f"  - Email: {user.email}, Role: {user.role}, Created: {user.created_at}")

async def create_test_user():
    """Создаёт тестового пользователя"""
    async with async_session_maker() as db:
        # Проверяем, существует ли уже
        result = await db.execute(select(User).where(User.email == "test@example.com"))
        existing = result.scalar_one_or_none()
        
        if existing:
            print("Test user already exists!")
            return
        
        test_user = User(
            id=generate_uuid(),
            email="test@example.com",
            password=hash_password("password123"),
            full_name="Test User",
            role="user"
        )
        db.add(test_user)
        await db.commit()
        print("Test user created!")

async def verify_password_test():
    """Проверяет работу verify_password"""
    hashed = hash_password("password123")
    is_valid = verify_password("password123", hashed)
    print(f"Password verification: {is_valid}")
    is_invalid = verify_password("wrongpassword", hashed)
    print(f"Wrong password verification: {is_invalid}")

async def main():
    print("=" * 60)
    print("Testing password hashing:")
    await verify_password_test()
    
    print("\n" + "=" * 60)
    print("Checking users in DB:")
    await check_users()
    
    print("\n" + "=" * 60)
    print("Creating test user:")
    await create_test_user()

if __name__ == "__main__":
    asyncio.run(main())

import pytest
from app.models import User
from app.core.security import hash_password


class TestAuthenticationEndpoints:
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_register_successful(self, client):
        response = await client.post(
            "/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePassword123!",
                "full_name": "New User",
                "role": "user"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["full_name"] == "New User"
        assert "password" not in data
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_register_duplicate_email(self, client, test_user):
        response = await client.post(
            "/auth/register",
            json={
                "email": test_user.email,
                "password": "NewPassword123!",
                "full_name": "Another User"
            }
        )
        
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_login_successful(self, client, test_user):
        response = await client.post(
            "/auth/login",
            data={
                "username": test_user.email,
                "password": "TestPassword123!"
            }
        )
        
        assert response.status_code == 200
        assert response.json()["message"] == "Login successful"
        
        assert "access_token" in response.cookies
        assert "refresh_token" in response.cookies
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_login_wrong_password(self, client, test_user):
        response = await client.post(
            "/auth/login",
            data={
                "username": test_user.email,
                "password": "WrongPassword"
            }
        )
        
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_login_nonexistent_user(self, client):
        response = await client.post(
            "/auth/login",
            data={
                "username": "nonexistent@example.com",
                "password": "AnyPassword123!"
            }
        )
        
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_get_current_user_authenticated(self, client, authenticated_client, test_user):
        response = await authenticated_client.get("/auth/me")
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
        assert data["full_name"] == test_user.full_name
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_get_current_user_unauthenticated(self, client):
        response = await client.get("/auth/me")
        
        assert response.status_code == 401
        assert "Invalid token" in response.json()["detail"]
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_logout_successful(self, client, authenticated_client):
        response = await authenticated_client.post("/auth/logout")
        
        assert response.status_code == 200
        assert response.json()["message"] == "Logout successful"


class TestTokenRefresh:
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_refresh_token_missing(self, client):
        response = await client.post("/auth/refresh")
        
        assert response.status_code == 401
        assert "Refresh token missing" in response.json()["detail"]


class TestPasswordValidation:

    @pytest.mark.integration
    @pytest.mark.auth
    async def test_register_valid_password_variations(self, client):
        passwords = [
            "SimplePassword1",
            "MyP@ssw0rd",
            "VeryLongPasswordWith1234567890Numbers"
        ]
        
        for i, password in enumerate(passwords):
            response = await client.post(
                "/auth/register",
                json={
                    "email": f"user{i}@example.com",
                    "password": password,
                    "full_name": f"User {i}"
                }
            )
            
            assert response.status_code == 200


class TestRoleBasedAccess:
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_admin_can_access_users_endpoint(self, client, test_admin_user):
        from app.services.auth_service import AuthService
        
        access_token = AuthService.create_access_token({"sub": test_admin_user.email})
        client.cookies.set("access_token", access_token)
        
        response = await client.get("/users")
        

        assert response.status_code in [200, 404]  
    
    @pytest.mark.integration
    @pytest.mark.auth
    async def test_regular_user_cannot_change_role(self, client, authenticated_client, test_user, test_admin_user):
        response = await authenticated_client.patch(
            f"/auth/users/{test_admin_user.id}/role",
            json={"new_role": "admin"}
        )
        

        assert response.status_code in [403, 400]



# python -m pytest tests/integration/test_auth_endpoints.py -v

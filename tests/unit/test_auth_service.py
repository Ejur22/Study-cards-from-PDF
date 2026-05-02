import pytest
from datetime import datetime, timedelta, timezone
from app.services.auth_service import AuthService
from app.core.security import hash_password, verify_password
from app.core.config import settings


class TestPasswordHashing:
    
    @pytest.mark.unit
    def test_hash_password_creates_different_hashes(self):
        password = "SecurePassword123!"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        
        assert hash1 != hash2
        assert verify_password(password, hash1)
        assert verify_password(password, hash2)
    
    @pytest.mark.unit
    def test_verify_password_correct(self):
        password = "MyPassword456!"
        hashed = hash_password(password)
        assert verify_password(password, hashed) == True
    
    @pytest.mark.unit
    def test_verify_password_incorrect(self):
        password = "CorrectPassword"
        wrong_password = "WrongPassword"
        hashed = hash_password(password)
        assert verify_password(wrong_password, hashed) == False
    
    @pytest.mark.unit
    def test_verify_password_case_sensitive(self):
        password = "Password123"
        hashed = hash_password(password)
        assert verify_password("password123", hashed) == False
        assert verify_password("PASSWORD123", hashed) == False


class TestAccessTokenGeneration:

    @pytest.mark.unit
    def test_create_access_token_includes_required_fields(self):
        data = {"sub": "user@example.com"}
        token = AuthService.create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 0
        from jose import jwt
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        assert payload.get("sub") == "user@example.com"
        assert payload.get("type") == "access"
        assert "exp" in payload
    
    @pytest.mark.unit
    def test_create_access_token_expiration(self):
        data = {"sub": "user@example.com"}
        token = AuthService.create_access_token(data)
        
        from jose import jwt
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        now = datetime.now(tz=timezone.utc)
        minutes_until_exp = (exp_time - now).total_seconds() / 60

        assert 14 < minutes_until_exp <= 15
    
    @pytest.mark.unit
    def test_create_access_token_with_custom_expiration(self):
        data = {"sub": "user@example.com"}
        expires_delta = timedelta(hours=2)
        token = AuthService.create_access_token(data, expires_delta)
        
        from jose import jwt
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        now = datetime.now(tz=timezone.utc)
        minutes_until_exp = (exp_time - now).total_seconds() / 60
        
        assert 119 < minutes_until_exp <= 120


class TestRefreshTokenGeneration:
    
    @pytest.mark.unit
    def test_create_refresh_token_includes_type(self):
        data = {"sub": "user@example.com"}
        token = AuthService.create_refresh_token(data)
        
        from jose import jwt
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        assert payload.get("type") == "refresh"
    
    @pytest.mark.unit
    def test_refresh_token_expires_in_7_days(self):
        data = {"sub": "user@example.com"}
        token = AuthService.create_refresh_token(data)
        
        from jose import jwt
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        now = datetime.now(tz=timezone.utc)
        days_until_exp = (exp_time - now).total_seconds() / (24 * 3600)
        
        assert 6.99 < days_until_exp <= 7


class TestTokenVerification:
    
    @pytest.mark.unit
    def test_verify_valid_token(self):
        data = {"sub": "user@example.com"}
        token = AuthService.create_access_token(data)
        
        payload = AuthService.verify_token(token)
        
        assert payload is not None
        assert payload.get("sub") == "user@example.com"
    
    @pytest.mark.unit
    def test_verify_invalid_token(self):
        fake_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.fake"
        
        payload = AuthService.verify_token(fake_token)
        
        assert payload is None
    
    @pytest.mark.unit
    def test_verify_expired_token(self):
        from datetime import timedelta
        expires_delta = timedelta(seconds=-1) 
        token = AuthService.create_access_token({"sub": "user"}, expires_delta)
        
        import time
        time.sleep(1)
        
        payload = AuthService.verify_token(token)
        
        assert payload is None


class TestCookieSettings:
    
    @pytest.mark.unit
    def test_set_auth_cookies_creates_secure_cookies(self):
        from unittest.mock import Mock
        
        response = Mock()
        response.set_cookie = Mock()
        
        access_token = "access_token_value"
        refresh_token = "refresh_token_value"
        
        AuthService.set_auth_cookies(response, access_token, refresh_token)
        
        assert response.set_cookie.call_count == 2
        
        first_call = response.set_cookie.call_args_list[0]
        assert first_call[1]["key"] == "access_token"
        assert first_call[1]["httponly"] == True
        assert first_call[1]["secure"] == False
        
        second_call = response.set_cookie.call_args_list[1]
        assert second_call[1]["key"] == "refresh_token"
        assert second_call[1]["httponly"] == True


# python -m pytest tests/unit/test_auth_service.py -v


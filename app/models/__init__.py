# Импортируем все модели для регистрации в SQLAlchemy
from app.models.user import User
from app.models.group import Group
from app.models.flashcard import Flashcard
from app.models.refresh_token import RefreshToken

__all__ = ["User", "Group", "Flashcard", "RefreshToken"]

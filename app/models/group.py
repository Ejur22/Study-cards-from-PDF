from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, String, func, select
from sqlalchemy.orm import column_property, relationship

from app.core.database import Base
from app.core.utils import generate_uuid
from app.models.flashcard import Flashcard


class Group(Base):
    __tablename__ = "groups"

    id = Column(String, primary_key=True, default=generate_uuid)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=True)  # Path to stored PDF file
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=True)  # Quiz score percentage (0-100)
    correct_answers = Column(String, nullable=True)  # JSON: {"correct": 7, "total": 10}
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))

    user = relationship("User", back_populates="groups")
    flashcards = relationship(
        "Flashcard", back_populates="group", cascade="all, delete-orphan"
    )

    flashcards_count = column_property(
        select(func.count(Flashcard.id))
        .where(Flashcard.group_id == id)
        .correlate_except(Flashcard)
        .scalar_subquery()
    )

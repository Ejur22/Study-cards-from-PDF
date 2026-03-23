from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class GroupResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str
    score: Optional[float]
    correct_answers: Optional[str]
    created_at: datetime
    flashcards_count: int


class GroupFilters(BaseModel):
    search: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    score_min: Optional[float] = None
    score_max: Optional[float] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"
    page: int = 1
    limit: int = 10


class PaginatedGroupsResponse(BaseModel):
    items: List[GroupResponse]
    total: int
    page: int
    limit: int
    pages: int


class FileUploadResponse(BaseModel):
    group_id: str
    filename: str
    message: str

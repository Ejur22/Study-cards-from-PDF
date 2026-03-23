from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.utils import generate_uuid
from app.models.flashcard import Flashcard
from app.models.group import Group
from app.schemas.group import FileUploadResponse, GroupResponse
from app.services.file_storage import FileStorageService
from app.services.llm import generate_flashcards
from app.services.pdf import extract_text_from_pdf

router = APIRouter()


from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import and_, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.utils import generate_uuid
from app.models.flashcard import Flashcard
from app.models.group import Group
from app.schemas.group import FileUploadResponse, GroupFilters, GroupResponse, PaginatedGroupsResponse
from app.services.file_storage import FileStorageService
from app.services.llm import generate_flashcards
from app.services.pdf import extract_text_from_pdf

router = APIRouter()


from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import and_, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.utils import generate_uuid
from app.models.flashcard import Flashcard
from app.models.group import Group
from app.schemas.group import FileUploadResponse, GroupFilters, GroupResponse, PaginatedGroupsResponse
from app.services.file_storage import FileStorageService
from app.services.llm import generate_flashcards
from app.services.pdf import extract_text_from_pdf

router = APIRouter()


class UpdateScoreRequest(BaseModel):
    score: float
    correct: int
    total: int


@router.get("/", response_model=PaginatedGroupsResponse)
async def get_user_groups(
    search: Optional[str] = Query(None, description="Search in filename"),
    date_from: Optional[datetime] = Query(None, description="Filter by date from"),
    date_to: Optional[datetime] = Query(None, description="Filter by date to"),
    score_min: Optional[float] = Query(None, description="Minimum score"),
    score_max: Optional[float] = Query(None, description="Maximum score"),
    sort_by: str = Query("created_at", description="Sort by field"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Base query
    q = select(Group).where(Group.user_id == current_user.id)

    # Apply filters
    filters = []
    if search:
        filters.append(Group.filename.ilike(f"%{search}%"))
    if date_from:
        filters.append(Group.created_at >= date_from)
    if date_to:
        filters.append(Group.created_at <= date_to)
    if score_min is not None:
        filters.append(Group.score >= score_min)
    if score_max is not None:
        filters.append(Group.score <= score_max)

    if filters:
        q = q.where(and_(*filters))

    # Get total count
    count_q = select(func.count()).select_from(q.subquery())
    total_result = await db.execute(count_q)
    total = total_result.scalar()

    # Apply sorting
    if sort_by == "created_at":
        order_col = Group.created_at
    elif sort_by == "filename":
        order_col = Group.filename
    elif sort_by == "score":
        order_col = Group.score
    else:
        order_col = Group.created_at

    if sort_order == "asc":
        q = q.order_by(order_col)
    else:
        q = q.order_by(desc(order_col))

    # Apply pagination
    q = q.offset((page - 1) * limit).limit(limit)

    result = await db.execute(q)
    groups = result.scalars().all()

    pages = (total + limit - 1) // limit

    return PaginatedGroupsResponse(
        items=groups,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.put("/{group_id}/score")
async def update_group_score(
    group_id: str,
    request: UpdateScoreRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    import json
    q = select(Group).where(Group.id == group_id)
    res = await db.execute(q)
    group = res.scalars().first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    if current_user.role != "admin" and group.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    group.score = request.score
    group.correct_answers = json.dumps({"correct": request.correct, "total": request.total})
    await db.commit()
    return {"detail": "Score updated"}


@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Validate file
    if not FileStorageService.validate_file(file):
        raise HTTPException(status_code=400, detail="Invalid file type or size")

    group_id = generate_uuid()
    # Read contents first
    contents = await file.read()
    # Reset file pointer for saving
    await file.seek(0)
    # Save file
    file_path = FileStorageService.save_file(file, f"{group_id}_{file.filename}")

    new_group = Group(
        id=group_id,
        filename=file.filename,
        file_path=file_path,
        user_id=current_user.id,
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_group)
    text = extract_text_from_pdf(contents)

    flashcards = await generate_flashcards(text)

    for card in flashcards:
        db.add(
            Flashcard(
                id=generate_uuid(),
                question=card["question"],
                options=card["options"],
                correct_index=card["correct_index"],
                user_id=current_user.id,
                group_id=group_id,
            )
        )
    await db.commit()
    return {
        "group_id": group_id,
        "filename": file.filename,
        "message": "File processed successfully",
    }


@router.delete("/{group_id}")
async def delete_group(
    group_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Group).where(Group.id == group_id)
    res = await db.execute(q)
    group = res.scalars().first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    # admin может удалять любые, user — только свои
    if current_user.role != "admin" and group.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    # Delete associated file
    if group.file_path:
        FileStorageService.delete_file(group.file_path)
    await db.execute(delete(Flashcard).where(Flashcard.group_id == group_id))
    await db.execute(delete(Group).where(Group.id == group_id))
    await db.commit()
    return {"detail": "Group deleted"}


@router.get("/{group_id}/download")
async def download_file(
    group_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Group).where(Group.id == group_id)
    res = await db.execute(q)
    group = res.scalars().first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    if current_user.role != "admin" and group.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    if not group.file_path:
        raise HTTPException(status_code=404, detail="File not found")
    file_path = FileStorageService.get_file_path(group.file_path)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path=file_path,
        filename=group.filename,
        media_type="application/pdf"
    )

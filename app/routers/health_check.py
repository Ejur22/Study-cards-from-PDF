from fastapi import APIRouter

router = APIRouter(tags=["Status"])

@router.get("/health-check")
def health_check():
    return {"status": "ok"}

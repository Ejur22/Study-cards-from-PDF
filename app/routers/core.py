from fastapi import APIRouter, UploadFile, File
from app.utils.file_handler import save_pdf

router = APIRouter(prefix="/app", tags=["App"])

test_history = []

@router.get("/home")
def home():
    return {"message": "User home"}

@router.get("/history")
def history():
    return {"history": test_history}

@router.post("/upload")
async def upload_file(pdf: UploadFile = File(...)):
    file_path = await save_pdf(pdf)
    test_history.append({"file": pdf.filename})
    return {"message": "File uploaded", "path": file_path}

@router.get("/start-test")
def start_test(file: str):
    return {"message": f"Test started for {file}"}

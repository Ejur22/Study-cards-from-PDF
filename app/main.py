from fastapi import FastAPI
from app.routers import auth, core, health_check
app = FastAPI(title="PDF Test Generator")

app.include_router(auth.router)
app.include_router(core.router)
app.include_router(health_check.router)

@app.get("/")
def root():
    return {"message": "Welcome to PDF Test Generator API"}

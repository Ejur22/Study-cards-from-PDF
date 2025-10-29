from fastapi import FastAPI
from routers import auth, core, status

app = FastAPI(title="PDF Test Generator")

app.include_router(auth.router)
app.include_router(core.router)
app.include_router(status.router)

@app.get("/")
def root():
    return {"message": "Welcome to PDF Test Generator API"}

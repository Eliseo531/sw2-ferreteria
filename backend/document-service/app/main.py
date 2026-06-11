from fastapi import FastAPI
from app.routes.documents import router as documents_router

app = FastAPI(
    title="Document Service - Ferretería",
    description="Microservicio para gestión documental con FastAPI",
    version="1.0.0"
)

@app.get("/")
def health_check():
    return {
        "message": "Document Service funcionando correctamente"
    }

app.include_router(documents_router, prefix="/documents", tags=["Documents"])
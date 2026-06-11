from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.ai import router as ai_router
from app.routes.ml import router as ml_router

app = FastAPI(
    title="AI Service - Ferretería",
    description="Microservicio de Inteligencia Artificial",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "message": "AI Service funcionando correctamente"
    }

app.include_router(
    ai_router,
    prefix="/ai",
    tags=["AI"]
)

app.include_router(
    ml_router,
    prefix="/ml",
    tags=["Machine Learning"]
)
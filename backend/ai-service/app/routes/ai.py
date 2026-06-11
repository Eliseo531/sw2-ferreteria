from fastapi import APIRouter, UploadFile, File

from app.services.image_classifier import classify_product
from app.services.demand_prediction import predict_demand
from app.services.customer_segmentation import segment_customer
from app.services.ai_log_service import save_ai_log, list_ai_logs
from pydantic import BaseModel

router = APIRouter()


@router.post("/classify-product")
async def classify_product_image(
    file: UploadFile = File(...)
):
    result = classify_product(file.filename)

    save_ai_log(
        action="CLASSIFY_PRODUCT_IMAGE",
        input_data={
            "filename": file.filename,
            "content_type": file.content_type
        },
        result=result
    )

    return {
        "filename": file.filename,
        **result
    }


@router.get("/predict-demand/{product_id}")
def predict_product_demand(product_id: int):
    result = predict_demand(product_id)

    save_ai_log(
        action="PREDICT_DEMAND",
        input_data={
            "product_id": product_id
        },
        result=result
    )

    return result


@router.get("/segment-customer/{customer_id}")
def customer_segmentation(customer_id: int):
    result = segment_customer(customer_id)

    save_ai_log(
        action="SEGMENT_CUSTOMER",
        input_data={
            "customer_id": customer_id
        },
        result=result
    )

    return result


@router.get("/logs")
def get_ai_logs():
    return {
        "logs": list_ai_logs()
    }
    
class MobileImageRequest(BaseModel):
    filename: str
    image_base64: str


@router.post("/classify-product-mobile")
def classify_product_mobile(request: MobileImageRequest):
    result = classify_product(request.filename)

    save_ai_log(
        action="CLASSIFY_PRODUCT_MOBILE",
        input_data={
            "filename": request.filename,
            "image_size_base64": len(request.image_base64)
        },
        result=result
    )

    return {
        "filename": request.filename,
        **result
    }
    
    from pydantic import BaseModel


class VoiceRequest(BaseModel):
    audio_base64: str
    filename: str


@router.post("/voice-query")
def voice_query(request: VoiceRequest):
    # Simulación de transcripción
    simulated_text = "cuanto stock hay de martillos"

    result = {
        "transcription": simulated_text,
        "intent": "CONSULTAR_STOCK",
        "product": "Martillo",
        "response": "Consulta recibida. Se identificó una solicitud de stock para Martillo."
    }

    save_ai_log(
        action="VOICE_QUERY",
        input_data={
            "filename": request.filename,
            "audio_size_base64": len(request.audio_base64)
        },
        result=result
    )

    return result
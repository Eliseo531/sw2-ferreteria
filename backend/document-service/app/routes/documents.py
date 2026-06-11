from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
import base64
import uuid

from app.services.storage_service import (
    upload_file_to_s3,
    generate_presigned_url,
    s3_client,
    AWS_BUCKET_NAME,
)
from app.services.metadata_service import (
    save_document_metadata,
    list_documents_by_related,
)

router = APIRouter()


class MobileEvidenceRequest(BaseModel):
    filename: str
    image_base64: str
    document_type: str
    related_type: str
    related_id: int


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    related_type: str = Form(...),
    related_id: int = Form(...),
):
    object_key = upload_file_to_s3(
        file.file,
        file.filename,
        file.content_type,
    )

    signed_url = generate_presigned_url(object_key)

    metadata = save_document_metadata(
        filename=file.filename,
        object_key=object_key,
        document_type=document_type,
        related_type=related_type,
        related_id=related_id,
    )

    return {
        "message": "Archivo subido correctamente a S3 y metadata guardada en DynamoDB",
        "metadata": metadata,
        "url_temporal": signed_url,
    }


@router.post("/upload-mobile")
def upload_mobile(request: MobileEvidenceRequest):
    file_bytes = base64.b64decode(request.image_base64)

    object_key = (
        f"{request.related_type}/"
        f"{request.related_id}/"
        f"{uuid.uuid4()}-{request.filename}"
    )

    s3_client.put_object(
        Bucket=AWS_BUCKET_NAME,
        Key=object_key,
        Body=file_bytes,
        ContentType="image/jpeg",
    )

    metadata = save_document_metadata(
        filename=request.filename,
        object_key=object_key,
        document_type=request.document_type,
        related_type=request.related_type,
        related_id=request.related_id,
    )

    signed_url = generate_presigned_url(object_key)

    return {
        "message": "Archivo móvil subido correctamente",
        "metadata": metadata,
        "url_temporal": signed_url,
    }


@router.get("/related/{related_type}/{related_id}")
async def get_documents_by_related(
    related_type: str,
    related_id: int,
):
    documents = list_documents_by_related(related_type, related_id)

    result = []

    for document in documents:
        url_temporal = generate_presigned_url(document["object_key"])

        result.append({
            **document,
            "url_temporal": url_temporal,
        })

    return {
        "documents": result
    }
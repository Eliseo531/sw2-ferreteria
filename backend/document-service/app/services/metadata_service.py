import uuid
from datetime import datetime, timezone
import boto3

from app.config import (
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    DYNAMODB_TABLE_NAME,
)

dynamodb = boto3.resource(
    "dynamodb",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

table = dynamodb.Table(DYNAMODB_TABLE_NAME)


def save_document_metadata(
    filename: str,
    object_key: str,
    document_type: str,
    related_type: str,
    related_id: int,
):
    document_id = str(uuid.uuid4())

    item = {
        "document_id": document_id,
        "filename": filename,
        "object_key": object_key,
        "document_type": document_type,
        "related_type": related_type,
        "related_id": str(related_id),
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }

    table.put_item(Item=item)

    return item


def list_documents_by_related(related_type: str, related_id: int):
    response = table.scan(
        FilterExpression="related_type = :related_type AND related_id = :related_id",
        ExpressionAttributeValues={
            ":related_type": related_type,
            ":related_id": str(related_id),
        },
    )

    return response.get("Items", [])
import uuid
import boto3
from app.config import (
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_BUCKET_NAME,
)

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)


def upload_file_to_s3(file_obj, filename: str, content_type: str):
    unique_filename = f"{uuid.uuid4()}-{filename}"

    s3_client.upload_fileobj(
        file_obj,
        AWS_BUCKET_NAME,
        unique_filename,
        ExtraArgs={
            "ContentType": content_type,
        },
    )

    return unique_filename


def generate_presigned_url(object_key: str, expiration: int = 3600):
    return s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": AWS_BUCKET_NAME,
            "Key": object_key,
        },
        ExpiresIn=expiration,
    )
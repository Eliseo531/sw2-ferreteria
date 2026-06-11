package com.ferreteria.documentservice.service;

import com.ferreteria.documentservice.dto.MobileUploadRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import java.time.Duration;



import java.io.IOException;
import java.time.Instant;
import java.util.*;

@Service
public class DocumentService {

    private final S3Client s3Client;
    private final DynamoDbClient dynamoDbClient;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.dynamodb.table}")
    private String tableName;

    public DocumentService(
        S3Client s3Client,
        DynamoDbClient dynamoDbClient,
        S3Presigner s3Presigner
) {
    this.s3Client = s3Client;
    this.dynamoDbClient = dynamoDbClient;
    this.s3Presigner = s3Presigner;
}

    public Map<String, Object> uploadMultipart(
            MultipartFile file,
            String documentType,
            String relatedType,
            Integer relatedId
    ) throws IOException {

        String objectKey = buildObjectKey(
                relatedType,
                relatedId,
                file.getOriginalFilename()
        );

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(
                putObjectRequest,
                RequestBody.fromBytes(file.getBytes())
        );

        Map<String, Object> metadata = saveMetadata(
                file.getOriginalFilename(),
                objectKey,
                documentType,
                relatedType,
                relatedId
        );

        return buildUploadResponse(metadata);
    }

    public Map<String, Object> uploadMobile(MobileUploadRequest request) {
        byte[] fileBytes = Base64.getDecoder().decode(request.getImageBase64());

        String objectKey = buildObjectKey(
                request.getRelatedType(),
                request.getRelatedId(),
                request.getFilename()
        );

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType("image/jpeg")
                .build();

        s3Client.putObject(
                putObjectRequest,
                RequestBody.fromBytes(fileBytes)
        );

        Map<String, Object> metadata = saveMetadata(
                request.getFilename(),
                objectKey,
                request.getDocumentType(),
                request.getRelatedType(),
                request.getRelatedId()
        );

        return buildUploadResponse(metadata);
    }

    public Map<String, Object> listByRelated(String relatedType, Integer relatedId) {
        ScanRequest scanRequest = ScanRequest.builder()
                .tableName(tableName)
                .build();

        ScanResponse response = dynamoDbClient.scan(scanRequest);

        List<Map<String, Object>> documents = new ArrayList<>();

        for (Map<String, AttributeValue> item : response.items()) {
            String itemRelatedType = getString(item, "related_type");
            String itemRelatedId = getString(item, "related_id");

            if (relatedType.equals(itemRelatedType)
        && String.valueOf(relatedId).equals(itemRelatedId)) {

    Map<String, Object> document = toSimpleMap(item);
    String objectKey = String.valueOf(document.get("object_key"));

    document.put("url_temporal", generatePresignedUrl(objectKey));

    documents.add(document);
}
        }

        Map<String, Object> result = new HashMap<>();
        result.put("documents", documents);

        return result;
    }

    private String buildObjectKey(
            String relatedType,
            Integer relatedId,
            String filename
    ) {
        return relatedType + "/"
                + relatedId + "/"
                + UUID.randomUUID() + "-"
                + filename;
    }

    private Map<String, Object> saveMetadata(
            String filename,
            String objectKey,
            String documentType,
            String relatedType,
            Integer relatedId
    ) {
        String id = UUID.randomUUID().toString();

        Map<String, AttributeValue> item = new HashMap<>();

        item.put("document_id", AttributeValue.builder().s(id).build());
        item.put("filename", AttributeValue.builder().s(filename).build());
        item.put("object_key", AttributeValue.builder().s(objectKey).build());
        item.put("document_type", AttributeValue.builder().s(documentType).build());
        item.put("related_type", AttributeValue.builder().s(relatedType).build());
        item.put("related_id", AttributeValue.builder().s(String.valueOf(relatedId)).build());
        item.put("created_at", AttributeValue.builder().s(Instant.now().toString()).build());

        PutItemRequest putItemRequest = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        dynamoDbClient.putItem(putItemRequest);

        return toSimpleMap(item);
    }

    private Map<String, Object> buildUploadResponse(Map<String, Object> metadata) {
        Map<String, Object> response = new HashMap<>();

        response.put("message", "Archivo subido correctamente");
        response.put("metadata", metadata);

        return response;
    }

    private String generatePresignedUrl(String objectKey) {
    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .build();

    GetObjectPresignRequest presignRequest =
            GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(15))
                    .getObjectRequest(getObjectRequest)
                    .build();

    return s3Presigner.presignGetObject(presignRequest)
            .url()
            .toString();
}

    private Map<String, Object> toSimpleMap(Map<String, AttributeValue> item) {
        Map<String, Object> map = new HashMap<>();

        item.forEach((key, value) -> {
            if (value.s() != null) {
                map.put(key, value.s());
            } else if (value.n() != null) {
                map.put(key, value.n());
            }
        });

        return map;
    }

    private String getString(Map<String, AttributeValue> item, String key) {
        if (!item.containsKey(key)) {
            return "";
        }

        return item.get(key).s();
    }
}
package com.ferreteria.documentservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.s3.S3Client;

import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class AwsConfig {

    @Value("${aws.s3.region}")
    private String s3Region;

    @Value("${aws.dynamodb.region}")
    private String dynamoRegion;

    @Value("${aws.access-key}")
    private String accessKey;

    @Value("${aws.secret-key}")
    private String secretKey;

    private StaticCredentialsProvider credentialsProvider() {
        AwsBasicCredentials credentials =
                AwsBasicCredentials.create(accessKey, secretKey);

        return StaticCredentialsProvider.create(credentials);
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(s3Region))
                .credentialsProvider(credentialsProvider())
                .build();
    }

    @Bean
    public DynamoDbClient dynamoDbClient() {
        return DynamoDbClient.builder()
                .region(Region.of(dynamoRegion))
                .credentialsProvider(credentialsProvider())
                .build();
    }

    @Bean
public S3Presigner s3Presigner() {
    return S3Presigner.builder()
            .region(Region.of(s3Region))
            .credentialsProvider(credentialsProvider())
            .build();
}
}
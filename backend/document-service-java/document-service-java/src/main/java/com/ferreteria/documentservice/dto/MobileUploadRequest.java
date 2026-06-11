package com.ferreteria.documentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MobileUploadRequest {

    @NotBlank
    private String filename;

    @NotBlank
    private String imageBase64;

    @NotBlank
    private String documentType;

    @NotBlank
    private String relatedType;

    @NotNull
    private Integer relatedId;

    public String getFilename() {
        return filename;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getRelatedType() {
        return relatedType;
    }

    public Integer getRelatedId() {
        return relatedId;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public void setRelatedType(String relatedType) {
        this.relatedType = relatedType;
    }

    public void setRelatedId(Integer relatedId) {
        this.relatedId = relatedId;
    }
}
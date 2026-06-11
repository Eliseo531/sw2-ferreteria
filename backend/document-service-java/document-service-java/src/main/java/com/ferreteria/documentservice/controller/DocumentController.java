package com.ferreteria.documentservice.controller;

import com.ferreteria.documentservice.dto.MobileUploadRequest;
import com.ferreteria.documentservice.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map<String, Object> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("document_type") String documentType,
            @RequestParam("related_type") String relatedType,
            @RequestParam("related_id") Integer relatedId
    ) throws IOException {
        return documentService.uploadMultipart(
                file,
                documentType,
                relatedType,
                relatedId
        );
    }

    @PostMapping("/upload-mobile")
    public Map<String, Object> uploadMobile(
            @Valid @RequestBody MobileUploadRequest request
    ) {
        return documentService.uploadMobile(request);
    }

    @GetMapping("/related/{relatedType}/{relatedId}")
    public Map<String, Object> related(
            @PathVariable String relatedType,
            @PathVariable Integer relatedId
    ) {
        return documentService.listByRelated(relatedType, relatedId);
    }
}
package com.customizedtrends.app.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
            ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image",
                "transformation", "f_auto,q_auto"
            )
        );
        
        return (String) uploadResult.get("secure_url");
    }

    public String uploadImage(byte[] imageData, String imageType, String folder) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(imageData, 
            ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image",
                "transformation", "f_auto,q_auto"
            )
        );
        
        return (String) uploadResult.get("secure_url");
    }

    public String generateThumbnailUrl(String originalUrl, int width, int height) {
        // Generate thumbnail URL by appending transformation parameters
        return originalUrl.replace("/upload/", "/upload/c_thumb,w_" + width + ",h_" + height + "/");
    }

    public String generateOptimizedUrl(String originalUrl) {
        // Generate optimized URL with quality and format optimization
        return originalUrl.replace("/upload/", "/upload/f_auto,q_auto/");
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
} 
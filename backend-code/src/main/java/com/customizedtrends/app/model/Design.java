package com.customizedtrends.app.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Design {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String type;
    private String theme;
    private String tags;
    private String uploadedBy;
    private LocalDate date;
    private String imageUrl;
    @Lob
    private byte[] imageData;
    private String imageType;
    private String description;
    
    // New fields for compression and thumbnails
    @Lob
    private byte[] thumbnailData;
    private String thumbnailType;
    private Long originalFileSize;
    private Long compressedFileSize;
    private Integer originalWidth;
    private Integer originalHeight;
    private Integer compressedWidth;
    private Integer compressedHeight;
    private String compressionRatio;

    public Design() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public byte[] getImageData() { return imageData; }
    public void setImageData(byte[] imageData) { this.imageData = imageData; }
    public String getImageType() { return imageType; }
    public void setImageType(String imageType) { this.imageType = imageType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    // New getters and setters for compression fields
    public byte[] getThumbnailData() { return thumbnailData; }
    public void setThumbnailData(byte[] thumbnailData) { this.thumbnailData = thumbnailData; }
    public String getThumbnailType() { return thumbnailType; }
    public void setThumbnailType(String thumbnailType) { this.thumbnailType = thumbnailType; }
    public Long getOriginalFileSize() { return originalFileSize; }
    public void setOriginalFileSize(Long originalFileSize) { this.originalFileSize = originalFileSize; }
    public Long getCompressedFileSize() { return compressedFileSize; }
    public void setCompressedFileSize(Long compressedFileSize) { this.compressedFileSize = compressedFileSize; }
    public Integer getOriginalWidth() { return originalWidth; }
    public void setOriginalWidth(Integer originalWidth) { this.originalWidth = originalWidth; }
    public Integer getOriginalHeight() { return originalHeight; }
    public void setOriginalHeight(Integer originalHeight) { this.originalHeight = originalHeight; }
    public Integer getCompressedWidth() { return compressedWidth; }
    public void setCompressedWidth(Integer compressedWidth) { this.compressedWidth = compressedWidth; }
    public Integer getCompressedHeight() { return compressedHeight; }
    public void setCompressedHeight(Integer compressedHeight) { this.compressedHeight = compressedHeight; }
    public String getCompressionRatio() { return compressionRatio; }
    public void setCompressionRatio(String compressionRatio) { this.compressionRatio = compressionRatio; }
} 
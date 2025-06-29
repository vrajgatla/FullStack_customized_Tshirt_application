package com.customizedtrends.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Tshirt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Brand brand;

    @ManyToOne(optional = false)
    private Color color;

    @ElementCollection
    private List<String> sizes;

    private String gender;
    private String material;
    private String fit;
    private String sleeveType;
    private String neckType;
    private Double price;
    private Integer stock;
    private Boolean featured;
    private String tags;
    @Lob
    private byte[] imageData;
    private String imageType;
    private String description;
    private String name;
    
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
    
    // Created date field
    private LocalDateTime createdAt;

    public Tshirt() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Brand getBrand() { return brand; }
    public void setBrand(Brand brand) { this.brand = brand; }
    public Color getColor() { return color; }
    public void setColor(Color color) { this.color = color; }
    public List<String> getSizes() { return sizes; }
    public void setSizes(List<String> sizes) { this.sizes = sizes; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public String getFit() { return fit; }
    public void setFit(String fit) { this.fit = fit; }
    public String getSleeveType() { return sleeveType; }
    public void setSleeveType(String sleeveType) { this.sleeveType = sleeveType; }
    public String getNeckType() { return neckType; }
    public void setNeckType(String neckType) { this.neckType = neckType; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public byte[] getImageData() { return imageData; }
    public void setImageData(byte[] imageData) { this.imageData = imageData; }
    public String getImageType() { return imageType; }
    public void setImageType(String imageType) { this.imageType = imageType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
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
    
    // Created date getter and setter
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 
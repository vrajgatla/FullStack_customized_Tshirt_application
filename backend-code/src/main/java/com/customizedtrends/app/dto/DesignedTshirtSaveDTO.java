package com.customizedtrends.app.dto;

import java.util.List;

public class DesignedTshirtSaveDTO {
    private String name;
    private Long brandId;
    private Long colorId;
    private Long designId; // Optional, if using gallery design
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
    private String description;
    
    // Design customization details
    private String customDesignName;
    private Double designZoom;
    private Integer designPositionX;
    private Integer designPositionY;
    private String tshirtZoom;
    
    // Image data (base64 encoded)
    private String imageData;
    private String imageType;

    // Constructors
    public DesignedTshirtSaveDTO() {}

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }
    
    public Long getColorId() { return colorId; }
    public void setColorId(Long colorId) { this.colorId = colorId; }
    
    public Long getDesignId() { return designId; }
    public void setDesignId(Long designId) { this.designId = designId; }
    
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
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCustomDesignName() { return customDesignName; }
    public void setCustomDesignName(String customDesignName) { this.customDesignName = customDesignName; }
    
    public Double getDesignZoom() { return designZoom; }
    public void setDesignZoom(Double designZoom) { this.designZoom = designZoom; }
    
    public Integer getDesignPositionX() { return designPositionX; }
    public void setDesignPositionX(Integer designPositionX) { this.designPositionX = designPositionX; }
    
    public Integer getDesignPositionY() { return designPositionY; }
    public void setDesignPositionY(Integer designPositionY) { this.designPositionY = designPositionY; }
    
    public String getTshirtZoom() { return tshirtZoom; }
    public void setTshirtZoom(String tshirtZoom) { this.tshirtZoom = tshirtZoom; }
    
    public String getImageData() { return imageData; }
    public void setImageData(String imageData) { this.imageData = imageData; }
    
    public String getImageType() { return imageType; }
    public void setImageType(String imageType) { this.imageType = imageType; }
}

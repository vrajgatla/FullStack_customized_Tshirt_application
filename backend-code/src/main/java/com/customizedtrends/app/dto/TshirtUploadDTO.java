package com.customizedtrends.app.dto;

import lombok.Data;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@Data
public class TshirtUploadDTO {
    private String name;
    private String brand;
    private String color;
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
    private List<MultipartFile> images;

    public List<MultipartFile> getImages() { return images; }
    public void setImages(List<MultipartFile> images) { this.images = images; }
} 
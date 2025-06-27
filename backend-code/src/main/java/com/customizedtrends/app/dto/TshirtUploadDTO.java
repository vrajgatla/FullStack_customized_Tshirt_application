package com.customizedtrends.app.dto;

import lombok.Data;
import java.util.List;

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
} 
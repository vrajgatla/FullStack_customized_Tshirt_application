package com.customizedtrends.app.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class DesignedTshirtImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    private Boolean isMain = false;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "designed_tshirt_id")
    private DesignedTshirt designedTshirt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Boolean getIsMain() { return isMain; }
    public void setIsMain(Boolean isMain) { this.isMain = isMain; }
    public DesignedTshirt getDesignedTshirt() { return designedTshirt; }
    public void setDesignedTshirt(DesignedTshirt designedTshirt) { this.designedTshirt = designedTshirt; }
} 
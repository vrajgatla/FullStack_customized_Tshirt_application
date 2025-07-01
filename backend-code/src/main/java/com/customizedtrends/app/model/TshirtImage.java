package com.customizedtrends.app.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class TshirtImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;
    private String type; // e.g., main, thumbnail, etc. (optional)
    private boolean isMain = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "designed_tshirt_id")
    private DesignedTshirt designedTshirt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tshirt_id")
    @JsonIgnore
    private Tshirt tshirt;

    public TshirtImage() {}

    public TshirtImage(String imageUrl, boolean isMain, DesignedTshirt designedTshirt) {
        this.imageUrl = imageUrl;
        this.isMain = isMain;
        this.designedTshirt = designedTshirt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean getIsMain() { return isMain; }
    public void setIsMain(boolean isMain) { this.isMain = isMain; }

    public DesignedTshirt getDesignedTshirt() { return designedTshirt; }
    public void setDesignedTshirt(DesignedTshirt designedTshirt) { this.designedTshirt = designedTshirt; }

    public Tshirt getTshirt() { return tshirt; }
    public void setTshirt(Tshirt tshirt) { this.tshirt = tshirt; }
} 
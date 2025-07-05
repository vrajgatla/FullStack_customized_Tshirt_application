package com.customizedtrends.app.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class HomePageConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String heroImageUrl;
    private String heroHeadline;
    private String heroSubheadline;

    @ElementCollection
    private List<Long> featuredProductIds;

    private Long productOfTheWeekId;

    private String bannerText;
    private String bannerImageUrl;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getHeroImageUrl() { return heroImageUrl; }
    public void setHeroImageUrl(String heroImageUrl) { this.heroImageUrl = heroImageUrl; }
    public String getHeroHeadline() { return heroHeadline; }
    public void setHeroHeadline(String heroHeadline) { this.heroHeadline = heroHeadline; }
    public String getHeroSubheadline() { return heroSubheadline; }
    public void setHeroSubheadline(String heroSubheadline) { this.heroSubheadline = heroSubheadline; }
    public List<Long> getFeaturedProductIds() { return featuredProductIds; }
    public void setFeaturedProductIds(List<Long> featuredProductIds) { this.featuredProductIds = featuredProductIds; }
    public Long getProductOfTheWeekId() { return productOfTheWeekId; }
    public void setProductOfTheWeekId(Long productOfTheWeekId) { this.productOfTheWeekId = productOfTheWeekId; }
    public String getBannerText() { return bannerText; }
    public void setBannerText(String bannerText) { this.bannerText = bannerText; }
    public String getBannerImageUrl() { return bannerImageUrl; }
    public void setBannerImageUrl(String bannerImageUrl) { this.bannerImageUrl = bannerImageUrl; }
} 
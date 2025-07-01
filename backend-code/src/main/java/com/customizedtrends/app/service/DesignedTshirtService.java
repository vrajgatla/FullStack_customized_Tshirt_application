package com.customizedtrends.app.service;

import com.customizedtrends.app.model.DesignedTshirt;
import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.model.DesignedTshirtImage;
import com.customizedtrends.app.repository.DesignedTshirtRepository;
import com.customizedtrends.app.repository.BrandRepository;
import com.customizedtrends.app.repository.ColorRepository;
import com.customizedtrends.app.repository.DesignRepository;
import com.customizedtrends.app.repository.DesignedTshirtImageRepository;
import com.customizedtrends.app.service.CloudinaryService;
import com.customizedtrends.app.dto.DesignedTshirtSaveDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class DesignedTshirtService {

    @Autowired
    private DesignedTshirtRepository designedTshirtRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private DesignRepository designRepository;

    @Autowired
    private DesignedTshirtImageRepository designedTshirtImageRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Create a new designed t-shirt
    public DesignedTshirt createDesignedTshirt(DesignedTshirt designedTshirt, String imageUrl, String thumbnailUrl, String optimizedUrl, String adminUsername) {
        try {
            // Set metadata
            designedTshirt.setCreatedBy(adminUsername);
            designedTshirt.setIsActive(true);

            // Set Cloudinary URLs if provided
            if (imageUrl != null && !imageUrl.isEmpty()) {
                designedTshirt.setImageUrl(imageUrl);
                designedTshirt.setThumbnailUrl(thumbnailUrl);
                designedTshirt.setOptimizedUrl(optimizedUrl);
                designedTshirt.setImageType("image/jpeg"); // Default type
                
                // Set placeholder metadata (these would be set by Cloudinary service)
                designedTshirt.setOriginalFileSize(0L);
                designedTshirt.setCompressedFileSize(0L);
                designedTshirt.setOriginalWidth(800);
                designedTshirt.setOriginalHeight(600);
                designedTshirt.setCompressedWidth(400);
                designedTshirt.setCompressedHeight(300);
                designedTshirt.setCompressionRatio("0%");
            }

            return designedTshirtRepository.save(designedTshirt);
        } catch (Exception e) {
            throw new RuntimeException("Error creating designed t-shirt: " + e.getMessage());
        }
    }

    // Get all active designed t-shirts
    public List<DesignedTshirt> getAllActiveDesignedTshirts() {
        return designedTshirtRepository.findByIsActiveTrue();
    }

    // Get all active designed t-shirts with pagination
    public Page<DesignedTshirt> getAllActiveDesignedTshirts(Pageable pageable) {
        return designedTshirtRepository.findByIsActiveTrue(pageable);
    }

    // Get designed t-shirt by ID
    public Optional<DesignedTshirt> getDesignedTshirtById(Long id) {
        Optional<DesignedTshirt> designedTshirt = designedTshirtRepository.findById(id);
        if (designedTshirt.isPresent() && designedTshirt.get().getIsActive()) {
            return designedTshirt;
        }
        return Optional.empty();
    }

    // Get featured designed t-shirts
    public List<DesignedTshirt> getFeaturedDesignedTshirts() {
        return designedTshirtRepository.findByFeaturedTrueAndIsActiveTrue();
    }

    // Search designed t-shirts
    public Page<DesignedTshirt> searchDesignedTshirts(String search, Pageable pageable) {
        return designedTshirtRepository.searchDesignedTshirts(search, pageable);
    }

    // Update designed t-shirt
    public DesignedTshirt updateDesignedTshirt(Long id, DesignedTshirt updatedDesignedTshirt, String imageUrl, String thumbnailUrl, String optimizedUrl) {
        Optional<DesignedTshirt> existingOptional = designedTshirtRepository.findById(id);
        if (existingOptional.isPresent()) {
            DesignedTshirt existing = existingOptional.get();
            
            // Update basic fields
            existing.setName(updatedDesignedTshirt.getName());
            existing.setBrand(updatedDesignedTshirt.getBrand());
            existing.setColor(updatedDesignedTshirt.getColor());
            existing.setDesign(updatedDesignedTshirt.getDesign());
            existing.setSizes(updatedDesignedTshirt.getSizes());
            existing.setGender(updatedDesignedTshirt.getGender());
            existing.setMaterial(updatedDesignedTshirt.getMaterial());
            existing.setFit(updatedDesignedTshirt.getFit());
            existing.setSleeveType(updatedDesignedTshirt.getSleeveType());
            existing.setNeckType(updatedDesignedTshirt.getNeckType());
            existing.setPrice(updatedDesignedTshirt.getPrice());
            existing.setStock(updatedDesignedTshirt.getStock());
            existing.setFeatured(updatedDesignedTshirt.getFeatured());
            existing.setTags(updatedDesignedTshirt.getTags());
            existing.setDescription(updatedDesignedTshirt.getDescription());
            
            // Update design customization details
            existing.setCustomDesignName(updatedDesignedTshirt.getCustomDesignName());
            existing.setDesignZoom(updatedDesignedTshirt.getDesignZoom());
            existing.setDesignPositionX(updatedDesignedTshirt.getDesignPositionX());
            existing.setDesignPositionY(updatedDesignedTshirt.getDesignPositionY());
            existing.setTshirtZoom(updatedDesignedTshirt.getTshirtZoom());

            // Update Cloudinary URLs if provided
            if (imageUrl != null && !imageUrl.isEmpty()) {
                existing.setImageUrl(imageUrl);
                existing.setThumbnailUrl(thumbnailUrl);
                existing.setOptimizedUrl(optimizedUrl);
                existing.setImageType("image/jpeg"); // Default type
            }

            return designedTshirtRepository.save(existing);
        }
        throw new RuntimeException("Designed t-shirt not found with id: " + id);
    }

    // Delete designed t-shirt (soft delete)
    public void deleteDesignedTshirt(Long id) {
        Optional<DesignedTshirt> existingOptional = designedTshirtRepository.findById(id);
        if (existingOptional.isPresent()) {
            DesignedTshirt existing = existingOptional.get();
            existing.setIsActive(false);
            designedTshirtRepository.save(existing);
        } else {
            throw new RuntimeException("Designed t-shirt not found with id: " + id);
        }
    }

    // Get designed t-shirts by brand
    public List<DesignedTshirt> getDesignedTshirtsByBrand(String brandName) {
        return designedTshirtRepository.findByBrand_NameAndIsActiveTrue(brandName);
    }

    // Get designed t-shirts by color
    public List<DesignedTshirt> getDesignedTshirtsByColor(String colorName) {
        return designedTshirtRepository.findByColor_NameAndIsActiveTrue(colorName);
    }

    // Get designed t-shirts by gender
    public List<DesignedTshirt> getDesignedTshirtsByGender(String gender) {
        return designedTshirtRepository.findByGenderAndIsActiveTrue(gender);
    }

    // Get designed t-shirts by brand and color
    public List<DesignedTshirt> getDesignedTshirtsByBrandAndColor(String brandName, String colorName) {
        return designedTshirtRepository.findByBrand_NameAndColor_NameAndIsActiveTrue(brandName, colorName);
    }

    // Get designed t-shirts by admin
    public List<DesignedTshirt> getDesignedTshirtsByAdmin(String adminUsername) {
        return designedTshirtRepository.findByCreatedByAndIsActiveTrue(adminUsername);
    }

    // Get count of active designed t-shirts
    public long getActiveDesignedTshirtsCount() {
        return designedTshirtRepository.countByIsActiveTrue();
    }

    public DesignedTshirt createDesignedTshirtWithImages(DesignedTshirtSaveDTO dto, List<MultipartFile> images, Integer mainImageIndex) throws IOException {
        DesignedTshirt designedTshirt = new DesignedTshirt();
        // Set fields from dto (populate all fields as in your current logic)
        designedTshirt.setName(dto.getName());
        if (dto.getBrandId() != null) {
            brandRepository.findById(dto.getBrandId()).ifPresent(designedTshirt::setBrand);
        }
        if (dto.getColorId() != null) {
            colorRepository.findById(dto.getColorId()).ifPresent(designedTshirt::setColor);
        }
        if (dto.getDesignId() != null) {
            designRepository.findById(dto.getDesignId()).ifPresent(designedTshirt::setDesign);
        }
        designedTshirt.setSizes(dto.getSizes());
        designedTshirt.setGender(dto.getGender());
        designedTshirt.setMaterial(dto.getMaterial());
        designedTshirt.setFit(dto.getFit());
        designedTshirt.setSleeveType(dto.getSleeveType());
        designedTshirt.setNeckType(dto.getNeckType());
        designedTshirt.setPrice(dto.getPrice());
        designedTshirt.setStock(dto.getStock());
        designedTshirt.setFeatured(dto.getFeatured());
        designedTshirt.setTags(dto.getTags());
        designedTshirt.setDescription(dto.getDescription());
        designedTshirt.setCustomDesignName(dto.getCustomDesignName());
        designedTshirt.setDesignZoom(dto.getDesignZoom());
        designedTshirt.setDesignPositionX(dto.getDesignPositionX());
        designedTshirt.setDesignPositionY(dto.getDesignPositionY());
        designedTshirt.setTshirtZoom(dto.getTshirtZoom());
        // Save the designed t-shirt first
        DesignedTshirt saved = designedTshirtRepository.save(designedTshirt);
        if (images != null && !images.isEmpty()) {
            List<DesignedTshirtImage> imageEntities = new ArrayList<>();
            for (int i = 0; i < images.size(); i++) {
                MultipartFile image = images.get(i);
                String url = cloudinaryService.uploadImage(image, "designed-tshirts");
                DesignedTshirtImage img = new DesignedTshirtImage();
                img.setImageUrl(url);
                img.setDesignedTshirt(saved);
                img.setIsMain(mainImageIndex != null ? (i == mainImageIndex) : (i == 0));
                imageEntities.add(designedTshirtImageRepository.save(img));
            }
            saved.setImages(imageEntities);
            designedTshirtRepository.save(saved);
        }
        return saved;
    }
}

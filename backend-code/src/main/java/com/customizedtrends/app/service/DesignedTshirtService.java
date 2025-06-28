package com.customizedtrends.app.service;

import com.customizedtrends.app.model.DesignedTshirt;
import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.repository.DesignedTshirtRepository;
import com.customizedtrends.app.repository.BrandRepository;
import com.customizedtrends.app.repository.ColorRepository;
import com.customizedtrends.app.repository.DesignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

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
    private ImageCompressionService imageCompressionService;

    // Create a new designed t-shirt
    public DesignedTshirt createDesignedTshirt(DesignedTshirt designedTshirt, MultipartFile imageFile, String adminUsername) {
        try {
            // Set metadata
            designedTshirt.setCreatedBy(adminUsername);
            designedTshirt.setIsActive(true);

            // Process and compress image if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                byte[] originalImageData = imageFile.getBytes();
                String imageType = imageFile.getContentType();

                // Compress the image
                byte[] compressedImageData = imageCompressionService.compressImage(originalImageData, imageType);
                
                // Generate thumbnail
                byte[] thumbnailData = imageCompressionService.generateThumbnail(originalImageData, 200);

                // Set image data
                designedTshirt.setImageData(compressedImageData);
                designedTshirt.setImageType(imageType);
                designedTshirt.setThumbnailData(thumbnailData);
                designedTshirt.setThumbnailType(imageType);

                // Set compression details
                designedTshirt.setOriginalFileSize((long) originalImageData.length);
                designedTshirt.setCompressedFileSize((long) compressedImageData.length);
                
                // Get image dimensions (you might need to implement this in ImageCompressionService)
                // For now, we'll set placeholder values
                designedTshirt.setOriginalWidth(800);
                designedTshirt.setOriginalHeight(600);
                designedTshirt.setCompressedWidth(400);
                designedTshirt.setCompressedHeight(300);
                
                double compressionRatio = ((double) compressedImageData.length / originalImageData.length) * 100;
                designedTshirt.setCompressionRatio(String.format("%.1f%%", compressionRatio));
            }

            return designedTshirtRepository.save(designedTshirt);
        } catch (IOException e) {
            throw new RuntimeException("Error processing image: " + e.getMessage());
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
    public DesignedTshirt updateDesignedTshirt(Long id, DesignedTshirt updatedDesignedTshirt, MultipartFile imageFile) {
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

            // Update image if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    byte[] originalImageData = imageFile.getBytes();
                    String imageType = imageFile.getContentType();

                    // Compress the image
                    byte[] compressedImageData = imageCompressionService.compressImage(originalImageData, imageType);
                    
                    // Generate thumbnail
                    byte[] thumbnailData = imageCompressionService.generateThumbnail(originalImageData, 200);

                    // Set image data
                    existing.setImageData(compressedImageData);
                    existing.setImageType(imageType);
                    existing.setThumbnailData(thumbnailData);
                    existing.setThumbnailType(imageType);

                    // Set compression details
                    existing.setOriginalFileSize((long) originalImageData.length);
                    existing.setCompressedFileSize((long) compressedImageData.length);
                    
                    double compressionRatio = ((double) compressedImageData.length / originalImageData.length) * 100;
                    existing.setCompressionRatio(String.format("%.1f%%", compressionRatio));
                } catch (IOException e) {
                    throw new RuntimeException("Error processing image: " + e.getMessage());
                }
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
}

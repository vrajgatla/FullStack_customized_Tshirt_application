package com.customizedtrends.app.service;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Tshirt;
import com.customizedtrends.app.repository.TshirtRepository;
import com.customizedtrends.app.model.TshirtImage;
import com.customizedtrends.app.repository.TshirtImageRepository;
import com.customizedtrends.app.dto.TshirtUploadDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.io.IOException;

@Service
public class TshirtService {
    private static final Logger logger = LoggerFactory.getLogger(TshirtService.class);
    @Autowired
    private TshirtRepository tshirtRepository;
    @Autowired
    private TshirtImageRepository tshirtImageRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private BrandService brandService;
    @Autowired
    private ColorService colorService;

    public List<Tshirt> getAllTshirts() {
        return tshirtRepository.findAll();
    }

    public Optional<Tshirt> getTshirtById(Long id) {
        return tshirtRepository.findById(id);
    }

    public Tshirt createTshirt(Tshirt tshirt) {
        return tshirtRepository.save(tshirt);
    }

    public Tshirt updateTshirt(Long id, Tshirt updatedTshirt) {
        return tshirtRepository.findById(id)
            .map(tshirt -> {
                tshirt.setBrand(updatedTshirt.getBrand());
                tshirt.setColor(updatedTshirt.getColor());
                tshirt.setSizes(updatedTshirt.getSizes());
                tshirt.setGender(updatedTshirt.getGender());
                tshirt.setMaterial(updatedTshirt.getMaterial());
                tshirt.setFit(updatedTshirt.getFit());
                tshirt.setSleeveType(updatedTshirt.getSleeveType());
                tshirt.setNeckType(updatedTshirt.getNeckType());
                tshirt.setPrice(updatedTshirt.getPrice());
                tshirt.setStock(updatedTshirt.getStock());
                tshirt.setFeatured(updatedTshirt.getFeatured());
                tshirt.setTags(updatedTshirt.getTags());
                tshirt.setDescription(updatedTshirt.getDescription());
                tshirt.setName(updatedTshirt.getName());
                
                // Update Cloudinary URLs
                tshirt.setImageUrl(updatedTshirt.getImageUrl());
                tshirt.setThumbnailUrl(updatedTshirt.getThumbnailUrl());
                tshirt.setOptimizedUrl(updatedTshirt.getOptimizedUrl());
                tshirt.setImageType(updatedTshirt.getImageType());
                
                return tshirtRepository.save(tshirt);
            })
            .orElseThrow(() -> new RuntimeException("Tshirt not found"));
    }

    public void deleteTshirt(Long id) {
        tshirtRepository.deleteById(id);
    }

    public Page<Tshirt> getAllTshirts(Pageable pageable) {
        return tshirtRepository.findAll(pageable);
    }
    
    public Optional<Tshirt> findByBrandAndColor(Brand brand, Color color) {
        return tshirtRepository.findByBrandAndColor(brand, color);
    }
    
    public Optional<Tshirt> findByBrandColorAndGender(Brand brand, Color color, String gender) {
        return tshirtRepository.findByBrandAndColorAndGender(brand, color, gender);
    }
    
    public Page<Tshirt> searchTshirts(String query, Pageable pageable) {
        return tshirtRepository.searchTshirts(query, pageable);
    }
    
    public Page<Tshirt> filterTshirts(String brand, String color, String gender, Pageable pageable) {
        return tshirtRepository.filterTshirts(brand, color, gender, pageable);
    }
    
    public Page<Tshirt> getTshirtsWithFilters(String search, String brand, String color, String gender, Pageable pageable) {
        if (!search.isEmpty()) {
            return searchTshirts(search, pageable);
        } else if (!brand.isEmpty() || !color.isEmpty() || !gender.isEmpty()) {
            return filterTshirts(brand, color, gender, pageable);
        } else {
            return getAllTshirts(pageable);
        }
    }

    // Get available colors for a specific brand
    public List<Color> getAvailableColorsByBrand(String brandName) {
        return tshirtRepository.findAvailableColorsByBrand(brandName);
    }

    // Get available colors for a specific gender
    public List<Color> getAvailableColorsByGender(String gender) {
        return tshirtRepository.findAvailableColorsByGender(gender);
    }

    // Get available colors for a specific brand and gender combination
    public List<Color> getAvailableColorsByBrandAndGender(String brandName, String gender) {
        return tshirtRepository.findAvailableColorsByBrandAndGender(brandName, gender);
    }

    // Get all colors that have t-shirts
    public List<Color> getAllAvailableColors() {
        return tshirtRepository.findAllAvailableColors();
    }

    // Get available brands for a specific gender
    public List<Brand> getAvailableBrandsByGender(String gender) {
        return tshirtRepository.findAvailableBrandsByGender(gender);
    }

    // Get all brands that have t-shirts
    public List<Brand> getAllAvailableBrands() {
        return tshirtRepository.findAllAvailableBrands();
    }

    public List<Tshirt> findAllByBrandColorGender(String brand, String color, String gender) {
        return tshirtRepository.findAllByBrandNameAndColorNameAndGender(brand, color, gender);
    }

    public Tshirt createTshirtWithImages(TshirtUploadDTO dto, List<MultipartFile> images, Integer mainImageIndex) throws IOException {
        Tshirt tshirt = new Tshirt();
        // Set fields from dto
        tshirt.setName(dto.getName());
        tshirt.setBrand(brandService.findBrandByName(dto.getBrand()).orElseThrow(() -> new RuntimeException("Brand not found: " + dto.getBrand())));
        tshirt.setColor(colorService.findColorByName(dto.getColor()).orElseThrow(() -> new RuntimeException("Color not found: " + dto.getColor())));
        tshirt.setSizes(dto.getSizes());
        tshirt.setGender(dto.getGender());
        tshirt.setMaterial(dto.getMaterial());
        tshirt.setFit(dto.getFit());
        tshirt.setSleeveType(dto.getSleeveType());
        tshirt.setNeckType(dto.getNeckType());
        tshirt.setPrice(dto.getPrice());
        tshirt.setStock(dto.getStock());
        tshirt.setFeatured(dto.getFeatured() != null && dto.getFeatured());
        tshirt.setTags(dto.getTags());
        tshirt.setDescription(dto.getDescription());
        // Save the tshirt first
        Tshirt savedTshirt = tshirtRepository.save(tshirt);
        // Handle multiple images
        if (images != null && !images.isEmpty()) {
            List<TshirtImage> imageEntities = new ArrayList<>();
            for (int i = 0; i < images.size(); i++) {
                MultipartFile image = images.get(i);
                if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image, "tshirts");
                    TshirtImage tshirtImage = new TshirtImage();
                    tshirtImage.setImageUrl(imageUrl);
                    tshirtImage.setTshirt(savedTshirt);
                    tshirtImage.setIsMain(mainImageIndex != null ? (i == mainImageIndex) : (i == 0));
                    imageEntities.add(tshirtImageRepository.save(tshirtImage));
                }
            }
            savedTshirt.setImages(imageEntities);
            tshirtRepository.save(savedTshirt);
        }
        return savedTshirt;
    }

    public void setMainTshirtImage(Long tshirtId, Long imageId) {
        Tshirt tshirt = tshirtRepository.findById(tshirtId).orElseThrow(() -> new RuntimeException("Tshirt not found"));
        List<TshirtImage> images = tshirt.getImages();
        for (TshirtImage img : images) {
            img.setIsMain(img.getId().equals(imageId));
            tshirtImageRepository.save(img);
        }
    }

    public void updateTshirtWithImages(Long id, TshirtUploadDTO dto, List<MultipartFile> newImages, List<Long> removedImages, Long mainImageId) throws IOException {
        Tshirt tshirt = tshirtRepository.findById(id).orElseThrow(() -> new RuntimeException("Tshirt not found"));
        logger.info("Updating T-shirt {}: removing images {}, adding new images: {}", id, removedImages, newImages != null ? newImages.size() : 0);
        // Update fields
        tshirt.setName(dto.getName());
        tshirt.setBrand(brandService.findBrandByName(dto.getBrand()).orElseThrow(() -> new RuntimeException("Brand not found: " + dto.getBrand())));
        tshirt.setColor(colorService.findColorByName(dto.getColor()).orElseThrow(() -> new RuntimeException("Color not found: " + dto.getColor())));
        tshirt.setSizes(dto.getSizes());
        tshirt.setGender(dto.getGender());
        tshirt.setMaterial(dto.getMaterial());
        tshirt.setFit(dto.getFit());
        tshirt.setSleeveType(dto.getSleeveType());
        tshirt.setNeckType(dto.getNeckType());
        tshirt.setPrice(dto.getPrice());
        tshirt.setStock(dto.getStock());
        tshirt.setFeatured(dto.getFeatured() != null && dto.getFeatured());
        tshirt.setTags(dto.getTags());
        tshirt.setDescription(dto.getDescription());
        // Remove images
        if (removedImages != null && !removedImages.isEmpty()) {
            for (Long imgId : removedImages) {
                tshirtImageRepository.findById(imgId).ifPresent(img -> {
                    logger.info("Deleting image {} from T-shirt {}", imgId, id);
                    tshirtImageRepository.delete(img);
                });
            }
        }
        // Reload the T-shirt to get the updated images list
        tshirt = tshirtRepository.findById(id).orElseThrow(() -> new RuntimeException("Tshirt not found after image deletion"));
        // Add new images
        if (newImages != null && !newImages.isEmpty()) {
            List<TshirtImage> imageEntities = new ArrayList<>(tshirt.getImages());
            for (MultipartFile image : newImages) {
                if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image, "tshirts");
                    TshirtImage tshirtImage = new TshirtImage();
                    tshirtImage.setImageUrl(imageUrl);
                    tshirtImage.setTshirt(tshirt);
                    tshirtImage.setIsMain(false);
                    imageEntities.add(tshirtImageRepository.save(tshirtImage));
                    logger.info("Added new image to T-shirt {}: {}", id, imageUrl);
                }
            }
            tshirt.setImages(imageEntities);
        }
        // Set main image
        List<TshirtImage> images = tshirt.getImages();
        boolean mainSet = false;
        if (mainImageId != null && images != null && !images.isEmpty()) {
            for (TshirtImage img : images) {
                if (img.getId().equals(mainImageId)) {
                    img.setIsMain(true);
                    mainSet = true;
                    logger.info("Set image {} as main for T-shirt {}", img.getId(), id);
                } else {
                    img.setIsMain(false);
                }
                tshirtImageRepository.save(img);
            }
        }
        // If no main image set, set the first image as main
        if (!mainSet && images != null && !images.isEmpty()) {
            images.get(0).setIsMain(true);
            tshirtImageRepository.save(images.get(0));
            logger.info("No mainImageId provided or found, set first image {} as main for T-shirt {}", images.get(0).getId(), id);
        }
        tshirtRepository.save(tshirt);
    }
} 
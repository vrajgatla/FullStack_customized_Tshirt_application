package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.DesignedTshirt;
import com.customizedtrends.app.model.DesignedTshirtImage;
import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.dto.DesignedTshirtSaveDTO;
import com.customizedtrends.app.service.DesignedTshirtService;
import com.customizedtrends.app.repository.BrandRepository;
import com.customizedtrends.app.repository.ColorRepository;
import com.customizedtrends.app.repository.DesignRepository;
import com.customizedtrends.app.repository.DesignedTshirtRepository;
import com.customizedtrends.app.service.CloudinaryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api/designed-tshirts")
@CrossOrigin(origins = "*")
public class DesignedTshirtController {

    @Autowired
    private DesignedTshirtService designedTshirtService;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private DesignRepository designRepository;

    @Autowired
    private DesignedTshirtRepository designedTshirtRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostConstruct
    public void configureObjectMapper() {
        // Configure ObjectMapper to handle null values properly
        objectMapper.setSerializationInclusion(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL);
    }

    // Create a new designed t-shirt (Admin only)
    @PostMapping
    public ResponseEntity<?> createDesignedTshirt(
            @RequestParam("name") String name,
            @RequestParam("brandName") String brandName,
            @RequestParam("colorName") String colorName,
            @RequestParam("gender") String gender,
            @RequestParam("size") String size,
            @RequestParam(value = "designId", required = false) String designId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            DesignedTshirt designedTshirt = new DesignedTshirt();
            designedTshirt.setName(name);
            designedTshirt.setGender(gender);
            // Set brand by name
            Brand brand = brandRepository.findByName(brandName).orElse(null);
            if (brand != null) designedTshirt.setBrand(brand);
            // Set color by name
            Color color = colorRepository.findByName(colorName).orElse(null);
            if (color != null) designedTshirt.setColor(color);
            // Set size (if your model supports it)
            designedTshirt.setSizes(List.of(size));
            // Set design if provided
            if (designId != null && !designId.isEmpty()) {
                try {
                    Long dId = Long.parseLong(designId);
                    Design design = designRepository.findById(dId).orElse(null);
                    if (design != null) designedTshirt.setDesign(design);
                } catch (NumberFormatException ignored) {}
            }
            // Handle image upload to Cloudinary
            String imageUrl = null;
            String thumbnailUrl = null;
            String optimizedUrl = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                imageUrl = cloudinaryService.uploadImage(imageFile, "designed-tshirts");
                thumbnailUrl = cloudinaryService.generateThumbnailUrl(imageUrl, 200, 200);
                optimizedUrl = cloudinaryService.generateOptimizedUrl(imageUrl);
            }
            DesignedTshirt savedDesignedTshirt = designedTshirtService.createDesignedTshirt(
                designedTshirt, imageUrl, thumbnailUrl, optimizedUrl, null);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDesignedTshirt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating designed t-shirt: " + e.getMessage());
        }
    }

    // Get all active designed t-shirts
    @GetMapping
    public ResponseEntity<List<DesignedTshirt>> getAllDesignedTshirts() {
        List<DesignedTshirt> designedTshirts = designedTshirtService.getAllActiveDesignedTshirts();
        return ResponseEntity.ok(designedTshirts);
    }

    // Get all active designed t-shirts with pagination
    @GetMapping("/page")
    public ResponseEntity<Page<DesignedTshirt>> getDesignedTshirtsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String brand,
            @RequestParam(defaultValue = "") String color,
            @RequestParam(defaultValue = "") String gender) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        Page<DesignedTshirt> designedTshirts;
        
        if (!search.isEmpty()) {
            // If search is provided, use search method
            designedTshirts = designedTshirtService.searchDesignedTshirts(search, pageable);
        } else if (!brand.isEmpty() && !color.isEmpty() && !gender.isEmpty()) {
            // If brand, color, and gender are provided
            List<DesignedTshirt> filteredList = designedTshirtService.getDesignedTshirtsByBrandAndColor(brand, color);
            // Filter by gender as well
            filteredList = filteredList.stream()
                .filter(dt -> dt.getGender() != null && dt.getGender().equals(gender))
                .toList();
            designedTshirts = new org.springframework.data.domain.PageImpl<>(
                filteredList.subList(Math.min(page * size, filteredList.size()), 
                                   Math.min((page + 1) * size, filteredList.size())),
                pageable,
                filteredList.size()
            );
        } else if (!brand.isEmpty() && !color.isEmpty()) {
            // If both brand and color are provided
            List<DesignedTshirt> filteredList = designedTshirtService.getDesignedTshirtsByBrandAndColor(brand, color);
            // Convert List to Page manually (this is a simplified approach)
            designedTshirts = new org.springframework.data.domain.PageImpl<>(
                filteredList.subList(Math.min(page * size, filteredList.size()), 
                                   Math.min((page + 1) * size, filteredList.size())),
                pageable,
                filteredList.size()
            );
        } else if (!brand.isEmpty() && !gender.isEmpty()) {
            // If brand and gender are provided
            List<DesignedTshirt> filteredList = designedTshirtService.getDesignedTshirtsByBrand(brand);
            // Filter by gender as well
            filteredList = filteredList.stream()
                .filter(dt -> dt.getGender() != null && dt.getGender().equals(gender))
                .toList();
            designedTshirts = new org.springframework.data.domain.PageImpl<>(
                filteredList.subList(Math.min(page * size, filteredList.size()), 
                                   Math.min((page + 1) * size, filteredList.size())),
                pageable,
                filteredList.size()
            );
        } else if (!color.isEmpty() && !gender.isEmpty()) {
            // If color and gender are provided
            List<DesignedTshirt> filteredList = designedTshirtService.getDesignedTshirtsByColor(color);
            // Filter by gender as well
            filteredList = filteredList.stream()
                .filter(dt -> dt.getGender() != null && dt.getGender().equals(gender))
                .toList();
            designedTshirts = new org.springframework.data.domain.PageImpl<>(
                filteredList.subList(Math.min(page * size, filteredList.size()), 
                                   Math.min((page + 1) * size, filteredList.size())),
                pageable,
                filteredList.size()
            );
        } else if (!brand.isEmpty()) {
            // If only brand is provided
            List<DesignedTshirt> filteredList = designedTshirtService.getDesignedTshirtsByBrand(brand);
            designedTshirts = new org.springframework.data.domain.PageImpl<>(
                filteredList.subList(Math.min(page * size, filteredList.size()), 
                                   Math.min((page + 1) * size, filteredList.size())),
                pageable,
                filteredList.size()
            );
        } else if (!color.isEmpty()) {
            // If only color is provided
            List<DesignedTshirt> filteredList = designedTshirtService.getDesignedTshirtsByColor(color);
            designedTshirts = new org.springframework.data.domain.PageImpl<>(
                filteredList.subList(Math.min(page * size, filteredList.size()), 
                                   Math.min((page + 1) * size, filteredList.size())),
                pageable,
                filteredList.size()
            );
        } else if (!gender.isEmpty()) {
            // If only gender is provided
            List<DesignedTshirt> filteredList = designedTshirtService.getDesignedTshirtsByGender(gender);
            designedTshirts = new org.springframework.data.domain.PageImpl<>(
                filteredList.subList(Math.min(page * size, filteredList.size()), 
                                   Math.min((page + 1) * size, filteredList.size())),
                pageable,
                filteredList.size()
            );
        } else {
            // No filters, get all active
            designedTshirts = designedTshirtService.getAllActiveDesignedTshirts(pageable);
        }
        
        // Patch: ensure every DesignedTshirt has images array
        designedTshirts.forEach(dt -> {
            if (dt.getImages() == null || dt.getImages().isEmpty()) {
                if (dt.getImageUrl() != null && !dt.getImageUrl().isEmpty()) {
                    DesignedTshirtImage virtualImg = new DesignedTshirtImage();
                    virtualImg.setImageUrl(dt.getImageUrl());
                    virtualImg.setIsMain(true);
                    // Do not set designedTshirt to avoid recursion
                    ArrayList<DesignedTshirtImage> imgs = new ArrayList<>();
                    imgs.add(virtualImg);
                    dt.setImages(imgs);
                } else {
                    dt.setImages(new ArrayList<>());
                }
            }
        });
        return ResponseEntity.ok(designedTshirts);
    }

    // Get designed t-shirt by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDesignedTshirtById(@PathVariable Long id) {
        Optional<DesignedTshirt> designedTshirt = designedTshirtService.getDesignedTshirtById(id);
        if (designedTshirt.isPresent()) {
            DesignedTshirt dt = designedTshirt.get();
            if (dt.getImages() == null || dt.getImages().isEmpty()) {
                if (dt.getImageUrl() != null && !dt.getImageUrl().isEmpty()) {
                    DesignedTshirtImage virtualImg = new DesignedTshirtImage();
                    virtualImg.setImageUrl(dt.getImageUrl());
                    virtualImg.setIsMain(true);
                    ArrayList<DesignedTshirtImage> imgs = new ArrayList<>();
                    imgs.add(virtualImg);
                    dt.setImages(imgs);
                } else {
                    dt.setImages(new ArrayList<>());
                }
            }
            return ResponseEntity.ok(dt);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get featured designed t-shirts
    @GetMapping("/featured")
    public ResponseEntity<List<DesignedTshirt>> getFeaturedDesignedTshirts() {
        List<DesignedTshirt> featuredTshirts = designedTshirtService.getFeaturedDesignedTshirts();
        return ResponseEntity.ok(featuredTshirts);
    }

    // Search designed t-shirts
    @GetMapping("/search")
    public ResponseEntity<Page<DesignedTshirt>> searchDesignedTshirts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DesignedTshirt> results = designedTshirtService.searchDesignedTshirts(query, pageable);
        return ResponseEntity.ok(results);
    }

    // Update designed t-shirt (Admin only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDesignedTshirt(
            @PathVariable Long id,
            @RequestParam("designedTshirt") String designedTshirtJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Log the incoming data for debugging
            System.out.println("[UPDATE] Received update request for designed t-shirt ID: " + id);
            System.out.println("[UPDATE] JSON data: " + designedTshirtJson);
            
            // Parse the JSON string to DTO
            DesignedTshirtSaveDTO dto = objectMapper.readValue(designedTshirtJson, DesignedTshirtSaveDTO.class);
            System.out.println("[UPDATE] Parsed DTO - Name: " + dto.getName() + ", Featured: " + dto.getFeatured());
            
            // Validate required fields
            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Name is required");
            }
            
            // Convert DTO to entity
            DesignedTshirt updatedDesignedTshirt = new DesignedTshirt();
            updatedDesignedTshirt.setName(dto.getName());
            
            // Set brand
            if (dto.getBrandId() != null) {
                Optional<Brand> brand = brandRepository.findById(dto.getBrandId());
                if (brand.isPresent()) {
                    updatedDesignedTshirt.setBrand(brand.get());
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Brand not found with ID: " + dto.getBrandId());
                }
            }
            
            // Set color
            if (dto.getColorId() != null) {
                Optional<Color> color = colorRepository.findById(dto.getColorId());
                if (color.isPresent()) {
                    updatedDesignedTshirt.setColor(color.get());
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Color not found with ID: " + dto.getColorId());
                }
            }
            
            // Set design (if using gallery design)
            if (dto.getDesignId() != null) {
                Optional<Design> design = designRepository.findById(dto.getDesignId());
                design.ifPresent(updatedDesignedTshirt::setDesign);
            }
            
            // Set other properties with null checks
            updatedDesignedTshirt.setSizes(dto.getSizes() != null ? dto.getSizes() : new ArrayList<>());
            updatedDesignedTshirt.setGender(dto.getGender());
            updatedDesignedTshirt.setMaterial(dto.getMaterial());
            updatedDesignedTshirt.setFit(dto.getFit());
            updatedDesignedTshirt.setSleeveType(dto.getSleeveType());
            updatedDesignedTshirt.setNeckType(dto.getNeckType());
            updatedDesignedTshirt.setPrice(dto.getPrice());
            updatedDesignedTshirt.setStock(dto.getStock());
            updatedDesignedTshirt.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
            updatedDesignedTshirt.setTags(dto.getTags());
            updatedDesignedTshirt.setDescription(dto.getDescription());
            
            // Set design customization details
            updatedDesignedTshirt.setCustomDesignName(dto.getCustomDesignName());
            updatedDesignedTshirt.setDesignZoom(dto.getDesignZoom());
            updatedDesignedTshirt.setDesignPositionX(dto.getDesignPositionX());
            updatedDesignedTshirt.setDesignPositionY(dto.getDesignPositionY());
            updatedDesignedTshirt.setTshirtZoom(dto.getTshirtZoom());
            
            // Handle image upload to Cloudinary
            String imageUrl = null;
            String thumbnailUrl = null;
            String optimizedUrl = null;
            
            if (imageFile != null && !imageFile.isEmpty()) {
                imageUrl = cloudinaryService.uploadImage(imageFile, "designed-tshirts");
                thumbnailUrl = cloudinaryService.generateThumbnailUrl(imageUrl, 200, 200);
                optimizedUrl = cloudinaryService.generateOptimizedUrl(imageUrl);
            }
            
            System.out.println("[UPDATE] Calling service to update designed t-shirt");
            DesignedTshirt savedDesignedTshirt = designedTshirtService.updateDesignedTshirt(id, updatedDesignedTshirt, imageUrl, thumbnailUrl, optimizedUrl);
            System.out.println("[UPDATE] Successfully updated designed t-shirt: " + savedDesignedTshirt.getId());
            
            return ResponseEntity.ok(savedDesignedTshirt);
        } catch (Exception e) {
            System.err.println("[UPDATE] Error updating designed t-shirt: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating designed t-shirt: " + e.getMessage());
        }
    }

    // Delete designed t-shirt (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDesignedTshirt(@PathVariable Long id) {
        try {
            designedTshirtService.deleteDesignedTshirt(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting designed t-shirt: " + e.getMessage());
        }
    }

    // Get designed t-shirts by brand
    @GetMapping("/brand/{brandName}")
    public ResponseEntity<List<DesignedTshirt>> getDesignedTshirtsByBrand(@PathVariable String brandName) {
        List<DesignedTshirt> designedTshirts = designedTshirtService.getDesignedTshirtsByBrand(brandName);
        return ResponseEntity.ok(designedTshirts);
    }

    // Get designed t-shirts by color
    @GetMapping("/color/{colorName}")
    public ResponseEntity<List<DesignedTshirt>> getDesignedTshirtsByColor(@PathVariable String colorName) {
        List<DesignedTshirt> designedTshirts = designedTshirtService.getDesignedTshirtsByColor(colorName);
        return ResponseEntity.ok(designedTshirts);
    }

    // Get designed t-shirts by gender
    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<DesignedTshirt>> getDesignedTshirtsByGender(@PathVariable String gender) {
        List<DesignedTshirt> designedTshirts = designedTshirtService.getDesignedTshirtsByGender(gender);
        return ResponseEntity.ok(designedTshirts);
    }

    // Get designed t-shirts by admin
    @GetMapping("/admin/{adminUsername}")
    public ResponseEntity<List<DesignedTshirt>> getDesignedTshirtsByAdmin(@PathVariable String adminUsername) {
        List<DesignedTshirt> designedTshirts = designedTshirtService.getDesignedTshirtsByAdmin(adminUsername);
        return ResponseEntity.ok(designedTshirts);
    }

    // Get count of active designed t-shirts
    @GetMapping("/count")
    public ResponseEntity<Long> getDesignedTshirtsCount() {
        long count = designedTshirtService.getActiveDesignedTshirtsCount();
        return ResponseEntity.ok(count);
    }

    // Debug endpoint to check if there are any designed t-shirts
    @GetMapping("/debug/count")
    public ResponseEntity<String> getDebugCount() {
        long totalCount = designedTshirtRepository.count();
        long activeCount = designedTshirtRepository.countByIsActiveTrue();
        String debugInfo = String.format("Total designed t-shirts: %d, Active designed t-shirts: %d", totalCount, activeCount);
        return ResponseEntity.ok(debugInfo);
    }

    @PostMapping("/custom-design/upload")
    public ResponseEntity<?> uploadDesignedTshirt(
        @RequestPart("designedTshirt") String designedTshirtJson,
        @RequestPart(value = "images", required = false) List<MultipartFile> images,
        @RequestPart(value = "mainImageIndex", required = false) String mainImageIndexStr
    ) {
        try {
            DesignedTshirtSaveDTO dto = objectMapper.readValue(designedTshirtJson, DesignedTshirtSaveDTO.class);
            Integer mainImageIndex = null;
            if (mainImageIndexStr != null && !mainImageIndexStr.isEmpty()) {
                mainImageIndex = Integer.valueOf(mainImageIndexStr);
            }
            System.out.println("[UPLOAD] DesignedTshirt DTO: " + dto);
            System.out.println("[UPLOAD] Images count: " + (images != null ? images.size() : 0));
            System.out.println("[UPLOAD] Main image index: " + mainImageIndex);
            DesignedTshirt saved = designedTshirtService.createDesignedTshirtWithImages(dto, images, mainImageIndex);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading designed t-shirt: " + e.getMessage());
        }
    }
}

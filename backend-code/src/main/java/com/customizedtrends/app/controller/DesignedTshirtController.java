package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.DesignedTshirt;
import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.dto.DesignedTshirtSaveDTO;
import com.customizedtrends.app.service.DesignedTshirtService;
import com.customizedtrends.app.repository.BrandRepository;
import com.customizedtrends.app.repository.ColorRepository;
import com.customizedtrends.app.repository.DesignRepository;
import com.customizedtrends.app.repository.DesignedTshirtRepository;
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

import java.util.List;
import java.util.Optional;

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

    // Create a new designed t-shirt (Admin only)
    @PostMapping
    public ResponseEntity<?> createDesignedTshirt(
            @RequestParam("designedTshirt") String designedTshirtJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam("adminUsername") String adminUsername) {
        try {
            // Parse the JSON string to DTO
            DesignedTshirtSaveDTO dto = objectMapper.readValue(designedTshirtJson, DesignedTshirtSaveDTO.class);
            
            // Convert DTO to entity
            DesignedTshirt designedTshirt = new DesignedTshirt();
            designedTshirt.setName(dto.getName());
            
            // Set brand
            if (dto.getBrandId() != null) {
                Optional<Brand> brand = brandRepository.findById(dto.getBrandId());
                brand.ifPresent(designedTshirt::setBrand);
            }
            
            // Set color
            if (dto.getColorId() != null) {
                Optional<Color> color = colorRepository.findById(dto.getColorId());
                color.ifPresent(designedTshirt::setColor);
            }
            
            // Set design (if using gallery design)
            if (dto.getDesignId() != null) {
                Optional<Design> design = designRepository.findById(dto.getDesignId());
                design.ifPresent(designedTshirt::setDesign);
            }
            
            // Set other properties
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
            
            // Set design customization details
            designedTshirt.setCustomDesignName(dto.getCustomDesignName());
            designedTshirt.setDesignZoom(dto.getDesignZoom());
            designedTshirt.setDesignPositionX(dto.getDesignPositionX());
            designedTshirt.setDesignPositionY(dto.getDesignPositionY());
            designedTshirt.setTshirtZoom(dto.getTshirtZoom());
            
            DesignedTshirt savedDesignedTshirt = designedTshirtService.createDesignedTshirt(designedTshirt, imageFile, adminUsername);
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
        
        return ResponseEntity.ok(designedTshirts);
    }

    // Get designed t-shirt by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDesignedTshirtById(@PathVariable Long id) {
        Optional<DesignedTshirt> designedTshirt = designedTshirtService.getDesignedTshirtById(id);
        if (designedTshirt.isPresent()) {
            return ResponseEntity.ok(designedTshirt.get());
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
            // Parse the JSON string to DTO
            DesignedTshirtSaveDTO dto = objectMapper.readValue(designedTshirtJson, DesignedTshirtSaveDTO.class);
            
            // Convert DTO to entity
            DesignedTshirt updatedDesignedTshirt = new DesignedTshirt();
            updatedDesignedTshirt.setName(dto.getName());
            
            // Set brand
            if (dto.getBrandId() != null) {
                Optional<Brand> brand = brandRepository.findById(dto.getBrandId());
                brand.ifPresent(updatedDesignedTshirt::setBrand);
            }
            
            // Set color
            if (dto.getColorId() != null) {
                Optional<Color> color = colorRepository.findById(dto.getColorId());
                color.ifPresent(updatedDesignedTshirt::setColor);
            }
            
            // Set design (if using gallery design)
            if (dto.getDesignId() != null) {
                Optional<Design> design = designRepository.findById(dto.getDesignId());
                design.ifPresent(updatedDesignedTshirt::setDesign);
            }
            
            // Set other properties
            updatedDesignedTshirt.setSizes(dto.getSizes());
            updatedDesignedTshirt.setGender(dto.getGender());
            updatedDesignedTshirt.setMaterial(dto.getMaterial());
            updatedDesignedTshirt.setFit(dto.getFit());
            updatedDesignedTshirt.setSleeveType(dto.getSleeveType());
            updatedDesignedTshirt.setNeckType(dto.getNeckType());
            updatedDesignedTshirt.setPrice(dto.getPrice());
            updatedDesignedTshirt.setStock(dto.getStock());
            updatedDesignedTshirt.setFeatured(dto.getFeatured());
            updatedDesignedTshirt.setTags(dto.getTags());
            updatedDesignedTshirt.setDescription(dto.getDescription());
            
            // Set design customization details
            updatedDesignedTshirt.setCustomDesignName(dto.getCustomDesignName());
            updatedDesignedTshirt.setDesignZoom(dto.getDesignZoom());
            updatedDesignedTshirt.setDesignPositionX(dto.getDesignPositionX());
            updatedDesignedTshirt.setDesignPositionY(dto.getDesignPositionY());
            updatedDesignedTshirt.setTshirtZoom(dto.getTshirtZoom());
            
            DesignedTshirt savedDesignedTshirt = designedTshirtService.updateDesignedTshirt(id, updatedDesignedTshirt, imageFile);
            return ResponseEntity.ok(savedDesignedTshirt);
        } catch (Exception e) {
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

    // Get designed t-shirt image
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getDesignedTshirtImage(@PathVariable Long id) {
        Optional<DesignedTshirt> designedTshirt = designedTshirtService.getDesignedTshirtById(id);
        if (designedTshirt.isPresent() && designedTshirt.get().getImageData() != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(designedTshirt.get().getImageType()));
            
            // Add cache headers for designed t-shirt images
            headers.setCacheControl("public, max-age=86400"); // Cache for 24 hours
            headers.setETag("\"designed-" + id + "-" + designedTshirt.get().getCompressedFileSize() + "\"");
            headers.setLastModified(designedTshirt.get().getCreatedAt() != null ? designedTshirt.get().getCreatedAt().toInstant(java.time.ZoneOffset.UTC) : java.time.Instant.now());
            
            return new ResponseEntity<>(designedTshirt.get().getImageData(), headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get designed t-shirt thumbnail
    @GetMapping("/{id}/thumbnail")
    public ResponseEntity<byte[]> getDesignedTshirtThumbnail(@PathVariable Long id) {
        Optional<DesignedTshirt> designedTshirt = designedTshirtService.getDesignedTshirtById(id);
        if (designedTshirt.isPresent() && designedTshirt.get().getThumbnailData() != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(designedTshirt.get().getThumbnailType()));
            
            // Add cache headers for designed t-shirt thumbnails
            headers.setCacheControl("public, max-age=86400"); // Cache for 24 hours
            headers.setETag("\"designed-thumb-" + id + "-" + (designedTshirt.get().getThumbnailData() != null ? designedTshirt.get().getThumbnailData().length : 0) + "\"");
            headers.setLastModified(designedTshirt.get().getCreatedAt() != null ? designedTshirt.get().getCreatedAt().toInstant(java.time.ZoneOffset.UTC) : java.time.Instant.now());
            
            return new ResponseEntity<>(designedTshirt.get().getThumbnailData(), headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Download designed t-shirt image
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDesignedTshirtImage(@PathVariable Long id) {
        Optional<DesignedTshirt> designedTshirt = designedTshirtService.getDesignedTshirtById(id);
        if (designedTshirt.isPresent() && designedTshirt.get().getImageData() != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(designedTshirt.get().getImageType()));
            headers.setContentDispositionFormData("attachment", "designed-tshirt-" + id + ".jpg");
            return new ResponseEntity<>(designedTshirt.get().getImageData(), headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
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
}

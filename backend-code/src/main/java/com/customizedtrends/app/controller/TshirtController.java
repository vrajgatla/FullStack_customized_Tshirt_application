package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Tshirt;
import com.customizedtrends.app.dto.TshirtUploadDTO;
import com.customizedtrends.app.service.BrandService;
import com.customizedtrends.app.service.ColorService;
import com.customizedtrends.app.service.TshirtService;
import com.customizedtrends.app.service.ImageCompressionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import javax.imageio.ImageIO;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tshirts")
public class TshirtController {
    @Autowired
    private TshirtService tshirtService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private ColorService colorService;
    
    @Autowired
    private ImageCompressionService imageCompressionService;

    @GetMapping
    public Page<Tshirt> getAllTshirts(Pageable pageable) {
        return tshirtService.getAllTshirts(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tshirt> getTshirtById(@PathVariable Long id) {
        return tshirtService.getTshirtById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tshirt createTshirt(@RequestBody Tshirt tshirt) {
        return tshirtService.createTshirt(tshirt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tshirt> updateTshirt(@PathVariable Long id, @RequestBody Tshirt tshirt) {
        try {
            return ResponseEntity.ok(tshirtService.updateTshirt(id, tshirt));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTshirt(@PathVariable Long id) {
        tshirtService.deleteTshirt(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/update-with-image")
    public ResponseEntity<?> updateTshirtWithImage(
            @PathVariable Long id,
            @RequestPart(value = "tshirt", required = false) TshirtUploadDTO tshirtDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "deleteOldImage", required = false) String deleteOldImage
    ) throws IOException {
        return tshirtService.getTshirtById(id).map(tshirt -> {
            try {
                if (tshirtDto == null) {
                    return ResponseEntity.badRequest().body("T-shirt data is required");
                }
                
                // Find brand and color entities
                Brand brandEntity = brandService.findBrandByName(tshirtDto.getBrand())
                    .orElseThrow(() -> new RuntimeException("Brand not found: " + tshirtDto.getBrand()));
                Color colorEntity = colorService.findColorByName(tshirtDto.getColor())
                    .orElseThrow(() -> new RuntimeException("Color not found: " + tshirtDto.getColor()));
                
                // Update fields
                tshirt.setName(tshirtDto.getName());
                tshirt.setBrand(brandEntity);
                tshirt.setColor(colorEntity);
                tshirt.setSizes(tshirtDto.getSizes());
                tshirt.setGender(tshirtDto.getGender());
                tshirt.setMaterial(tshirtDto.getMaterial());
                tshirt.setFit(tshirtDto.getFit());
                tshirt.setSleeveType(tshirtDto.getSleeveType());
                tshirt.setNeckType(tshirtDto.getNeckType());
                tshirt.setPrice(tshirtDto.getPrice());
                tshirt.setStock(tshirtDto.getStock());
                tshirt.setFeatured(tshirtDto.getFeatured() != null && tshirtDto.getFeatured());
                tshirt.setTags(tshirtDto.getTags());
                tshirt.setDescription(tshirtDto.getDescription());
                
                // Handle image - automatically replace old image with new one
                if (image != null && !image.isEmpty()) {
                    // Always delete the old image when uploading a new one
                    tshirt.setImageData(null);
                    tshirt.setImageType(null);
                    tshirt.setThumbnailData(null);
                    tshirt.setThumbnailType(null);
                    
                    // Process and set the new image
                    processAndSetImage(tshirt, image);
                } else if ("true".equals(deleteOldImage)) {
                    // Only delete old image if explicitly requested and no new image provided
                    tshirt.setImageData(null);
                    tshirt.setImageType(null);
                    tshirt.setThumbnailData(null);
                    tshirt.setThumbnailType(null);
                }
                
                tshirtService.updateTshirt(id, tshirt);
                return ResponseEntity.ok(tshirt);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getTshirtImage(@PathVariable Long id, 
                                                @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch,
                                                @RequestHeader(value = "If-Modified-Since", required = false) String ifModifiedSince) {
        System.out.println("Image request for t-shirt ID: " + id);
        
        return tshirtService.getTshirtById(id)
                .filter(t -> t.getImageData() != null && t.getImageData().length > 0)
                .map(t -> {
                    System.out.println("Found image data for t-shirt ID: " + id + ", size: " + t.getImageData().length + " bytes");
                    
                    // Create ETag for cache validation
                    String etag = "\"" + id + "-" + t.getCompressedFileSize() + "\"";
                    
                    // Check if client has the latest version
                    if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                        System.out.println("Client has latest version, returning 304 Not Modified for t-shirt ID: " + id);
                        return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body((byte[]) null);
                    }
                    
                    // Check if client has a recent version based on modification time
                    if (ifModifiedSince != null && t.getCreatedAt() != null) {
                        try {
                            java.time.Instant clientTime = java.time.format.DateTimeFormatter.RFC_1123_DATE_TIME
                                .parse(ifModifiedSince, java.time.Instant::from);
                            if (!t.getCreatedAt().toInstant(java.time.ZoneOffset.UTC).isAfter(clientTime)) {
                                System.out.println("Client has recent version, returning 304 Not Modified for t-shirt ID: " + id);
                                return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body((byte[]) null);
                            }
                        } catch (Exception e) {
                            // Ignore parsing errors and continue with normal response
                        }
                    }
                    
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(t.getImageType() != null ? t.getImageType() : "image/png"));
                    
                    // Add cache headers to prevent repeated requests
                    headers.setCacheControl("public, max-age=86400"); // Cache for 24 hours
                    headers.setETag(etag);
                    headers.setLastModified(t.getCreatedAt() != null ? t.getCreatedAt().toInstant(java.time.ZoneOffset.UTC) : java.time.Instant.now());
                    
                    return new ResponseEntity<>(t.getImageData(), headers, org.springframework.http.HttpStatus.OK);
                })
                .orElse(ResponseEntity.<byte[]>notFound().build());
    }
    
    @GetMapping("/{id}/thumbnail")
    public ResponseEntity<byte[]> getTshirtThumbnail(@PathVariable Long id,
                                                    @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch,
                                                    @RequestHeader(value = "If-Modified-Since", required = false) String ifModifiedSince) {
        return tshirtService.getTshirtById(id)
                .filter(t -> t.getThumbnailData() != null)
                .map(t -> {
                    // Create ETag for cache validation
                    String etag = "\"thumb-" + id + "-" + (t.getThumbnailData() != null ? t.getThumbnailData().length : 0) + "\"";
                    
                    // Check if client has the latest version
                    if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                        return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body((byte[]) null);
                    }
                    
                    // Check if client has a recent version based on modification time
                    if (ifModifiedSince != null && t.getCreatedAt() != null) {
                        try {
                            java.time.Instant clientTime = java.time.format.DateTimeFormatter.RFC_1123_DATE_TIME
                                .parse(ifModifiedSince, java.time.Instant::from);
                            if (!t.getCreatedAt().toInstant(java.time.ZoneOffset.UTC).isAfter(clientTime)) {
                                return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body((byte[]) null);
                            }
                        } catch (Exception e) {
                            // Ignore parsing errors and continue with normal response
                        }
                    }
                    
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(t.getThumbnailType() != null ? t.getThumbnailType() : "image/jpeg"));
                    
                    // Add cache headers for thumbnails
                    headers.setCacheControl("public, max-age=86400"); // Cache for 24 hours
                    headers.setETag(etag);
                    headers.setLastModified(t.getCreatedAt() != null ? t.getCreatedAt().toInstant(java.time.ZoneOffset.UTC) : java.time.Instant.now());
                    
                    return new ResponseEntity<>(t.getThumbnailData(), headers, org.springframework.http.HttpStatus.OK);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body((byte[]) null));
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadTshirtImage(@PathVariable Long id) {
        return tshirtService.getTshirtById(id)
                .filter(t -> t.getImageData() != null)
                .map(t -> {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(t.getImageType() != null ? t.getImageType() : "image/png"));
                    headers.setContentDispositionFormData("attachment", t.getName() + ".png");
                    return new ResponseEntity<>(t.getImageData(), headers, org.springframework.http.HttpStatus.OK);
                })
                .orElse(ResponseEntity.<byte[]>notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadTshirt(
            @RequestPart(value = "tshirt", required = false) TshirtUploadDTO tshirtDto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        if (tshirtDto == null || image == null || image.isEmpty() || tshirtDto.getBrand() == null || tshirtDto.getColor() == null || tshirtDto.getName() == null || tshirtDto.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "T-shirt, image, brand, color, and name are required."));
        }
        try {
            Brand brand = brandService.findBrandByName(tshirtDto.getBrand())
                    .orElseThrow(() -> new RuntimeException("Brand not found: " + tshirtDto.getBrand()));

            Color color = colorService.findColorByName(tshirtDto.getColor())
                    .orElseThrow(() -> new RuntimeException("Color not found: " + tshirtDto.getColor()));

            Tshirt tshirt = new Tshirt();
            tshirt.setName(tshirtDto.getName());
            tshirt.setBrand(brand);
            tshirt.setColor(color);
            tshirt.setSizes(tshirtDto.getSizes());
            tshirt.setGender(tshirtDto.getGender());
            tshirt.setMaterial(tshirtDto.getMaterial());
            tshirt.setFit(tshirtDto.getFit());
            tshirt.setSleeveType(tshirtDto.getSleeveType());
            tshirt.setNeckType(tshirtDto.getNeckType());
            tshirt.setPrice(tshirtDto.getPrice());
            tshirt.setStock(tshirtDto.getStock());
            tshirt.setFeatured(tshirtDto.getFeatured() != null && tshirtDto.getFeatured());
            tshirt.setTags(tshirtDto.getTags());
            tshirt.setDescription(tshirtDto.getDescription());
            
            processAndSetImage(tshirt, image);
            
            tshirtService.createTshirt(tshirt);
            return ResponseEntity.ok(tshirt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Failed to upload t-shirt: " + e.getMessage()));
        }
    }
    
    private void processAndSetImage(Tshirt tshirt, MultipartFile image) throws IOException {
        // Store original file size
        tshirt.setOriginalFileSize((long) image.getBytes().length);
        
        // Get original dimensions
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(image.getBytes()));
        if (originalImage != null) {
            tshirt.setOriginalWidth(originalImage.getWidth());
            tshirt.setOriginalHeight(originalImage.getHeight());
        }
        
        // Compress the image
        byte[] compressedData = imageCompressionService.compressImage(image);
        tshirt.setImageData(compressedData);
        tshirt.setImageType(imageCompressionService.getCompressedContentType(image.getContentType()));
        
        // Store compressed file size
        tshirt.setCompressedFileSize((long) compressedData.length);
        
        // Calculate compression ratio
        if (tshirt.getOriginalFileSize() != null && tshirt.getOriginalFileSize() > 0) {
            double ratio = (double) tshirt.getCompressedFileSize() / tshirt.getOriginalFileSize();
            tshirt.setCompressionRatio(String.format("%.2f%%", (1 - ratio) * 100));
        }
        
        // Get compressed dimensions
        BufferedImage compressedImage = ImageIO.read(new ByteArrayInputStream(compressedData));
        if (compressedImage != null) {
            tshirt.setCompressedWidth(compressedImage.getWidth());
            tshirt.setCompressedHeight(compressedImage.getHeight());
        }
        
        // Generate thumbnail
        byte[] thumbnailData = imageCompressionService.generateThumbnail(compressedData, 200);
        tshirt.setThumbnailData(thumbnailData);
        tshirt.setThumbnailType("image/jpeg");
    }

    @GetMapping("/sizes")
    public List<String> getSizes() {
        return List.of("XS", "S", "M", "L", "XL", "XXL", "XXXL");
    }

    @GetMapping("/genders")
    public List<String> getGenders() {
        return List.of("Men", "Women", "Unisex", "Children");
    }

    @GetMapping("/materials")
    public List<String> getMaterials() {
        return List.of("Cotton", "Polyester", "Blend", "Organic Cotton", "Bamboo");
    }

    @GetMapping("/fits")
    public List<String> getFits() {
        return List.of("Regular", "Slim", "Oversized", "Relaxed", "Athletic");
    }

    @GetMapping("/sleeveTypes")
    public List<String> getSleeveTypes() {
        return List.of("Short Sleeve", "Long Sleeve", "Sleeveless", "3/4 Sleeve");
    }

    @GetMapping("/neckTypes")
    public List<String> getNeckTypes() {
        return List.of("Round Neck", "V-Neck", "Crew Neck", "Hooded", "Turtle Neck");
    }

    @GetMapping("/preview")
    public ResponseEntity<?> getTshirtPreview(
            @RequestParam String brand, 
            @RequestParam String color,
            @RequestParam(required = false) String gender) {
        try {
            Brand brandEntity = brandService.findBrandByName(brand)
                    .orElseThrow(() -> new RuntimeException("Brand not found: " + brand));
            Color colorEntity = colorService.findColorByName(color)
                    .orElseThrow(() -> new RuntimeException("Color not found: " + color));

            Optional<Tshirt> tshirt;
            if (gender != null && !gender.isEmpty()) {
                tshirt = tshirtService.findByBrandColorAndGender(brandEntity, colorEntity, gender);
            } else {
                tshirt = tshirtService.findByBrandAndColor(brandEntity, colorEntity);
            }

            return tshirt
                    .map(tshirtItem -> {
                        String imageEndpoint = "/api/tshirts/" + tshirtItem.getId() + "/image";
                        return ResponseEntity.ok(java.util.Map.of("imageEndpoint", imageEndpoint));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/trending")
    public List<Tshirt> getTrendingTshirts() {
        return tshirtService.getAllTshirts().stream()
                .filter(Tshirt::getFeatured)
                .limit(10)
                .toList();
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Tshirt>> getTshirtsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String brand,
            @RequestParam(defaultValue = "") String color,
            @RequestParam(defaultValue = "") String gender,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        Pageable pageable;
        if ("desc".equalsIgnoreCase(sortOrder)) {
            pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(sortBy).ascending());
        }
        
        Page<Tshirt> tshirts = tshirtService.getTshirtsWithFilters(search, brand, color, gender, pageable);
        return ResponseEntity.ok(tshirts);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Tshirt>> searchTshirts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("createdAt").descending());
        Page<Tshirt> results = tshirtService.searchTshirts(query, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Tshirt>> filterTshirts(
            @RequestParam(defaultValue = "") String brand,
            @RequestParam(defaultValue = "") String color,
            @RequestParam(defaultValue = "") String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        Pageable pageable;
        if ("desc".equalsIgnoreCase(sortOrder)) {
            pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(sortBy).ascending());
        }
        
        Page<Tshirt> results = tshirtService.filterTshirts(brand, color, gender, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/available-colors")
    public ResponseEntity<List<Color>> getAvailableColors(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String gender) {
        try {
            List<Color> availableColors;
            if (brand != null && !brand.isEmpty() && gender != null && !gender.isEmpty()) {
                // Get colors available for specific brand and gender
                availableColors = tshirtService.getAvailableColorsByBrandAndGender(brand, gender);
            } else if (brand != null && !brand.isEmpty()) {
                // Get colors available for specific brand
                availableColors = tshirtService.getAvailableColorsByBrand(brand);
            } else if (gender != null && !gender.isEmpty()) {
                // Get colors available for specific gender
                availableColors = tshirtService.getAvailableColorsByGender(gender);
            } else {
                // Get all colors that have t-shirts
                availableColors = tshirtService.getAllAvailableColors();
            }
            return ResponseEntity.ok(availableColors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/available-brands")
    public ResponseEntity<List<Brand>> getAvailableBrands(
            @RequestParam(required = false) String gender) {
        try {
            List<Brand> availableBrands;
            if (gender != null && !gender.isEmpty()) {
                availableBrands = tshirtService.getAvailableBrandsByGender(gender);
            } else {
                availableBrands = tshirtService.getAllAvailableBrands();
            }
            return ResponseEntity.ok(availableBrands);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 
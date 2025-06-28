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
import org.springframework.http.HttpHeaders;
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
    public ResponseEntity<byte[]> getTshirtImage(@PathVariable Long id) {
        System.out.println("Image request for t-shirt ID: " + id);
        
        return tshirtService.getTshirtById(id)
                .filter(t -> t.getImageData() != null && t.getImageData().length > 0)
                .map(t -> {
                    System.out.println("Found image data for t-shirt ID: " + id + ", size: " + t.getImageData().length + " bytes");
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(t.getImageType() != null ? t.getImageType() : "image/png"));
                    return new ResponseEntity<>(t.getImageData(), headers, org.springframework.http.HttpStatus.OK);
                })
                .orElseGet(() -> {
                    System.out.println("No image data found for t-shirt ID: " + id + ", returning 404");
                    try {
                        // Load default image from resources/static or classpath
                        InputStream is = getClass().getResourceAsStream("/static/fallback-tshirt.png");
                        if (is == null) {
                            // fallback if not found in static, try classpath root
                            is = getClass().getResourceAsStream("/fallback-tshirt.png");
                        }
                        if (is != null) {
                            byte[] defaultImage = is.readAllBytes();
                            HttpHeaders headers = new HttpHeaders();
                            headers.setContentType(MediaType.IMAGE_PNG);
                            System.out.println("Returning fallback image for t-shirt ID: " + id);
                            return new ResponseEntity<>(defaultImage, headers, org.springframework.http.HttpStatus.OK);
                        }
                    } catch (Exception e) {
                        System.out.println("Error loading fallback image: " + e.getMessage());
                    }
                    return ResponseEntity.notFound().build();
                });
    }
    
    @GetMapping("/{id}/thumbnail")
    public ResponseEntity<byte[]> getTshirtThumbnail(@PathVariable Long id) {
        return tshirtService.getTshirtById(id)
                .filter(t -> t.getThumbnailData() != null)
                .map(t -> {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(t.getThumbnailType() != null ? t.getThumbnailType() : "image/jpeg"));
                    return new ResponseEntity<>(t.getThumbnailData(), headers, org.springframework.http.HttpStatus.OK);
                })
                .orElse(ResponseEntity.notFound().build());
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
                .orElse(ResponseEntity.notFound().build());
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
        return List.of("Men", "Women", "Unisex", "Kids");
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
    public ResponseEntity<?> getTshirtPreview(@RequestParam String brand, @RequestParam String color) {
        try {
            Brand brandEntity = brandService.findBrandByName(brand)
                    .orElseThrow(() -> new RuntimeException("Brand not found: " + brand));
            Color colorEntity = colorService.findColorByName(color)
                    .orElseThrow(() -> new RuntimeException("Color not found: " + color));

            return tshirtService.findByBrandAndColor(brandEntity, colorEntity)
                    .map(tshirt -> {
                        String imageEndpoint = "/api/tshirts/" + tshirt.getId() + "/image";
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
} 
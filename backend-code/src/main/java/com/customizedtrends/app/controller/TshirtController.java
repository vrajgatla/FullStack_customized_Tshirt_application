package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Tshirt;
import com.customizedtrends.app.dto.TshirtUploadDTO;
import com.customizedtrends.app.service.BrandService;
import com.customizedtrends.app.service.ColorService;
import com.customizedtrends.app.service.TshirtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

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
                    
                    // Set the new image
                    tshirt.setImageData(image.getBytes());
                    tshirt.setImageType(image.getContentType());
                } else if ("true".equals(deleteOldImage)) {
                    // Only delete old image if explicitly requested and no new image provided
                    tshirt.setImageData(null);
                    tshirt.setImageType(null);
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
            tshirt.setImageData(image.getBytes());
            tshirt.setImageType(image.getContentType());
            tshirtService.createTshirt(tshirt);
            return ResponseEntity.ok(tshirt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Failed to upload t-shirt: " + e.getMessage()));
        }
    }

    @GetMapping("/sizes")
    public List<String> getSizes() {
        return tshirtService.getAllTshirts().stream()
                .flatMap(t -> t.getSizes() != null ? t.getSizes().stream() : java.util.stream.Stream.empty())
                .filter(size -> size != null && !size.isEmpty())
                .distinct()
                .toList();
    }

    @GetMapping("/genders")
    public List<String> getGenders() {
        return tshirtService.getAllTshirts().stream()
                .map(Tshirt::getGender)
                .filter(gender -> gender != null && !gender.isEmpty())
                .distinct()
                .toList();
    }

    @GetMapping("/materials")
    public List<String> getMaterials() {
        return tshirtService.getAllTshirts().stream()
                .map(Tshirt::getMaterial)
                .filter(material -> material != null && !material.isEmpty())
                .distinct()
                .toList();
    }

    @GetMapping("/fits")
    public List<String> getFits() {
        return tshirtService.getAllTshirts().stream()
                .map(Tshirt::getFit)
                .filter(fit -> fit != null && !fit.isEmpty())
                .distinct()
                .toList();
    }

    @GetMapping("/sleeveTypes")
    public List<String> getSleeveTypes() {
        return tshirtService.getAllTshirts().stream()
                .map(Tshirt::getSleeveType)
                .filter(sleeveType -> sleeveType != null && !sleeveType.isEmpty())
                .distinct()
                .toList();
    }

    @GetMapping("/neckTypes")
    public List<String> getNeckTypes() {
        return tshirtService.getAllTshirts().stream()
                .map(Tshirt::getNeckType)
                .filter(neckType -> neckType != null && !neckType.isEmpty())
                .distinct()
                .toList();
    }

    @GetMapping("/preview")
    public ResponseEntity<?> getTshirtPreview(@RequestParam String brand, @RequestParam String color) {
        // Find a t-shirt by brand and color, robust to case and spaces
        String brandParam = brand.trim().toLowerCase();
        String colorParam = color.trim().toLowerCase();
        return ResponseEntity.ok(
            tshirtService.getAllTshirts().stream()
                .filter(t -> t.getBrand() != null && t.getBrand().getName() != null && t.getBrand().getName().trim().toLowerCase().equals(brandParam))
                .filter(t -> t.getColor() != null && t.getColor().getName() != null && t.getColor().getName().trim().toLowerCase().equals(colorParam))
                .findFirst()
                .map(t -> {
                    String imageEndpoint = t.getImageData() != null ? "/api/tshirts/" + t.getId() + "/image" : null;
                    if (imageEndpoint != null) {
                        return java.util.Map.of("imageEndpoint", imageEndpoint, "id", t.getId());
                    } else {
                        return java.util.Map.of("imageAvailable", false);
                    }
                })
                .orElse(java.util.Map.of("imageAvailable", false))
        );
    }

    @GetMapping("/trending")
    public List<Tshirt> getTrendingTshirts() {
        // For now, return the first 8 featured t-shirts
        return tshirtService.getAllTshirts().stream()
                .filter(t -> Boolean.TRUE.equals(t.getFeatured()))
                .limit(8)
                .toList();
    }
} 
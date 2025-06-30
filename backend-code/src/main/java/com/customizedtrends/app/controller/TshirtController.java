package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Tshirt;
import com.customizedtrends.app.dto.TshirtUploadDTO;
import com.customizedtrends.app.service.BrandService;
import com.customizedtrends.app.service.ColorService;
import com.customizedtrends.app.service.TshirtService;
import com.customizedtrends.app.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    private CloudinaryService cloudinaryService;

    @GetMapping
    public Page<Tshirt> getAllTshirts(Pageable pageable) {
        return tshirtService.getAllTshirts(pageable);
    }

    @GetMapping("/id/{id}")
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
        @RequestPart(value = "tshirt") TshirtUploadDTO tshirtDto,
        @RequestPart(value = "image", required = false) MultipartFile image
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
            // Handle image upload
        
            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image, "tshirts");
                String thumbnailUrl = cloudinaryService.generateThumbnailUrl(imageUrl, 200, 200);
                String optimizedUrl = cloudinaryService.generateOptimizedUrl(imageUrl);
                tshirt.setImageUrl(imageUrl);
                tshirt.setThumbnailUrl(thumbnailUrl);
                tshirt.setOptimizedUrl(optimizedUrl);
                tshirt.setImageType(image.getContentType());
            }
            tshirtService.updateTshirt(id, tshirt);
            return ResponseEntity.ok(tshirt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }).orElse(ResponseEntity.notFound().build());
}

    @PostMapping("/upload")
public ResponseEntity<?> uploadTshirt(
        @RequestPart("tshirt") TshirtUploadDTO tshirtDto,
        @RequestPart(value = "image", required = false) MultipartFile image
) {
    if (tshirtDto == null) {
        return ResponseEntity.badRequest().body("T-shirt data is required");
    }
    try {
        // Find brand and color entities
        Brand brandEntity = brandService.findBrandByName(tshirtDto.getBrand())
            .orElseThrow(() -> new RuntimeException("Brand not found: " + tshirtDto.getBrand()));
        Color colorEntity = colorService.findColorByName(tshirtDto.getColor())
            .orElseThrow(() -> new RuntimeException("Color not found: " + tshirtDto.getColor()));
        Tshirt tshirt = new Tshirt();
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
   
          // Handle image upload
        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image, "tshirts");
            String thumbnailUrl = cloudinaryService.generateThumbnailUrl(imageUrl, 200, 200);
            String optimizedUrl = cloudinaryService.generateOptimizedUrl(imageUrl);
            tshirt.setImageUrl(imageUrl);
            tshirt.setThumbnailUrl(thumbnailUrl);
            tshirt.setOptimizedUrl(optimizedUrl);
            tshirt.setImageType(image.getContentType());
        }
        Tshirt savedTshirt = tshirtService.createTshirt(tshirt);
        return ResponseEntity.ok(savedTshirt);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Failed to upload t-shirt: " + e.getMessage());
    }
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
            
            return tshirt.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/trending")
    public List<Tshirt> getTrendingTshirts() {
        // Return featured t-shirts as trending
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
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Tshirt> tshirts = tshirtService.getTshirtsWithFilters(search, brand, color, gender, pageable);
        return ResponseEntity.ok(tshirts);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Tshirt>> searchTshirts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Tshirt> tshirts = tshirtService.searchTshirts(query, pageable);
        return ResponseEntity.ok(tshirts);
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
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Tshirt> tshirts = tshirtService.filterTshirts(brand, color, gender, pageable);
        return ResponseEntity.ok(tshirts);
    }

    @GetMapping("/available-colors")
    public ResponseEntity<List<Color>> getAvailableColors(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String gender) {
        try {
            List<Color> colors;
            if (brand != null && !brand.isEmpty() && gender != null && !gender.isEmpty()) {
                colors = tshirtService.getAvailableColorsByBrandAndGender(brand, gender);
            } else if (brand != null && !brand.isEmpty()) {
                colors = tshirtService.getAvailableColorsByBrand(brand);
            } else if (gender != null && !gender.isEmpty()) {
                colors = tshirtService.getAvailableColorsByGender(gender);
            } else {
                colors = tshirtService.getAllAvailableColors();
            }
            return ResponseEntity.ok(colors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/available-brands")
    public ResponseEntity<List<Brand>> getAvailableBrands(
            @RequestParam(required = false) String gender) {
        try {
            List<Brand> brands;
            if (gender != null && !gender.isEmpty()) {
                brands = tshirtService.getAvailableBrandsByGender(gender);
            } else {
                brands = tshirtService.getAllAvailableBrands();
            }
            return ResponseEntity.ok(brands);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/byBrandColorGender")
    public List<Tshirt> getByBrandColorGender(
            @RequestParam String brand,
            @RequestParam String color,
            @RequestParam String gender
    ) {
        return tshirtService.findAllByBrandColorGender(brand, color, gender);
    }
} 
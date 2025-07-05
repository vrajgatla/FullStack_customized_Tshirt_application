package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.model.DesignedTshirt;
import com.customizedtrends.app.model.OrderItem;
import com.customizedtrends.app.service.DesignService;
import com.customizedtrends.app.service.CloudinaryService;
import com.customizedtrends.app.repository.DesignedTshirtRepository;
import com.customizedtrends.app.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/designs")
@CrossOrigin(origins = "*")
public class DesignController {
    @Autowired
    private DesignService designService;

    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private DesignedTshirtRepository designedTshirtRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping
    public Page<Design> getAllDesigns(Pageable pageable) {
        return designService.getAllDesigns(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Design> getDesignById(@PathVariable Long id) {
        return designService.getDesignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Design createDesign(@RequestBody Design design) {
        return designService.createDesign(design);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Design> updateDesign(@PathVariable Long id, @RequestBody Design design) {
        return ResponseEntity.ok(designService.updateDesign(id, design));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDesign(@PathVariable Long id) {
        try {
        designService.deleteDesign(id);
        return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Failed to delete design: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/force-delete")
    public ResponseEntity<?> forceDeleteDesign(@PathVariable Long id) {
        try {
            designService.forceDeleteDesign(id);
            return ResponseEntity.ok().body(java.util.Map.of("message", "Design and all its references have been deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Failed to force delete design: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/update-with-image")
    public ResponseEntity<?> updateDesignWithImage(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("theme") String theme,
            @RequestParam("tags") String tags,
            @RequestParam("uploadedBy") String uploadedBy,
            @RequestParam("date") String date,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {
        return designService.getDesignById(id).map(design -> {
            design.setName(name);
            design.setType(type);
            design.setTheme(theme);
            design.setTags(tags);
            design.setUploadedBy(uploadedBy);
            design.setDate(java.time.LocalDate.parse(date));
            design.setDescription(description);
            if (image != null && !image.isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadImage(image, "designs");
                    String thumbnailUrl = cloudinaryService.generateThumbnailUrl(imageUrl, 200, 200);
                    String optimizedUrl = cloudinaryService.generateOptimizedUrl(imageUrl);
                    
                    design.setImageUrl(imageUrl);
                    design.setThumbnailUrl(thumbnailUrl);
                    design.setOptimizedUrl(optimizedUrl);
                    design.setImageType(image.getContentType());
                } catch (IOException e) {
                    return ResponseEntity.badRequest().body("Failed to upload image: " + e.getMessage());
                }
            }
            designService.createDesign(design); // save
            return ResponseEntity.ok(design);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDesign(
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("theme") String theme,
            @RequestParam("tags") String tags,
            @RequestParam("uploadedBy") String uploadedBy,
            @RequestParam("date") String date,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        if (name == null || name.isEmpty() || image == null || image.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Name and image are required."));
        }
        try {
            Design design = new Design();
            design.setName(name);
            design.setType(type);
            design.setTheme(theme);
            design.setTags(tags);
            design.setUploadedBy(uploadedBy);
            design.setDate(java.time.LocalDate.parse(date));
            design.setDescription(description);
            
            String imageUrl = cloudinaryService.uploadImage(image, "designs");
            String thumbnailUrl = cloudinaryService.generateThumbnailUrl(imageUrl, 200, 200);
            String optimizedUrl = cloudinaryService.generateOptimizedUrl(imageUrl);
            
            design.setImageUrl(imageUrl);
            design.setThumbnailUrl(thumbnailUrl);
            design.setOptimizedUrl(optimizedUrl);
            design.setImageType(image.getContentType());
            
            designService.createDesign(design);
            return ResponseEntity.ok(design);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Failed to upload design: " + e.getMessage()));
        }
    }

    @GetMapping("/types")
    public List<String> getDesignTypes() {
        return designService.getAllDesigns().stream()
                .map(Design::getType)
                .filter(type -> type != null && !type.isEmpty())
                .distinct()
                .toList();
    }

    @GetMapping("/themes")
    public List<String> getDesignThemes() {
        return designService.getAllDesigns().stream()
                .map(Design::getTheme)
                .filter(theme -> theme != null && !theme.isEmpty())
                .distinct()
                .toList();
    }

    @GetMapping("/{id}/can-delete")
    public ResponseEntity<?> canDeleteDesign(@PathVariable Long id) {
        try {
            boolean canDelete = designService.canDeleteDesign(id);
            
            if (!canDelete) {
                // Get the specific references for better error message
                List<DesignedTshirt> designedTshirts = designedTshirtRepository.findByDesignId(id);
                List<OrderItem> orderItems = orderItemRepository.findByDesignId(id);
                
                return ResponseEntity.ok(java.util.Map.of(
                    "canDelete", false,
                    "designedTshirtsCount", designedTshirts.size(),
                    "orderItemsCount", orderItems.size(),
                    "message", "Design cannot be deleted. It is referenced by " + 
                        (designedTshirts.size() + orderItems.size()) + " item(s)."
                ));
            }
            
            return ResponseEntity.ok(java.util.Map.of(
                "canDelete", true,
                "message", "Design can be deleted safely"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
} 
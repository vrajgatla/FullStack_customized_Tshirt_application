package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.service.DesignService;
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
import java.util.List;
import javax.imageio.ImageIO;

@RestController
@RequestMapping("/api/designs")
public class DesignController {
    @Autowired
    private DesignService designService;
    
    @Autowired
    private ImageCompressionService imageCompressionService;

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
        try {
            return ResponseEntity.ok(designService.updateDesign(id, design));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDesign(@PathVariable Long id) {
        designService.deleteDesign(id);
        return ResponseEntity.noContent().build();
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
                    processAndSetImage(design, image);
                } catch (IOException e) {
                    return ResponseEntity.badRequest().body("Failed to process image: " + e.getMessage());
                }
            }
            designService.createDesign(design); // save
            return ResponseEntity.ok(design);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getDesignImage(@PathVariable Long id) {
        return designService.getDesignById(id)
                .filter(d -> d.getImageData() != null)
                .map(d -> {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(d.getImageType() != null ? d.getImageType() : "image/png"));
                    
                    // Add cache headers for design images
                    headers.setCacheControl("public, max-age=86400"); // Cache for 24 hours
                    headers.setETag("\"design-" + id + "-" + d.getCompressedFileSize() + "\"");
                    headers.setLastModified(java.time.Instant.now()); // Use current time since Design has no timestamp
                    
                    return new ResponseEntity<>(d.getImageData(), headers, org.springframework.http.HttpStatus.OK);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/thumbnail")
    public ResponseEntity<byte[]> getDesignThumbnail(@PathVariable Long id) {
        return designService.getDesignById(id)
                .filter(d -> d.getThumbnailData() != null)
                .map(d -> {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(d.getThumbnailType() != null ? d.getThumbnailType() : "image/jpeg"));
                    
                    // Add cache headers for design thumbnails
                    headers.setCacheControl("public, max-age=86400"); // Cache for 24 hours
                    headers.setETag("\"design-thumb-" + id + "-" + (d.getThumbnailData() != null ? d.getThumbnailData().length : 0) + "\"");
                    headers.setLastModified(java.time.Instant.now()); // Use current time since Design has no timestamp
                    
                    return new ResponseEntity<>(d.getThumbnailData(), headers, org.springframework.http.HttpStatus.OK);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDesignImage(@PathVariable Long id) {
        return designService.getDesignById(id)
                .filter(d -> d.getImageData() != null)
                .map(d -> {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(d.getImageType() != null ? d.getImageType() : "image/png"));
                    headers.setContentDispositionFormData("attachment", d.getName() + ".png");
                    return new ResponseEntity<>(d.getImageData(), headers, org.springframework.http.HttpStatus.OK);
                })
                .orElse(ResponseEntity.notFound().build());
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
            
            processAndSetImage(design, image);
            
            designService.createDesign(design);
            return ResponseEntity.ok(design);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Failed to upload design: " + e.getMessage()));
        }
    }
    
    private void processAndSetImage(Design design, MultipartFile image) throws IOException {
        // Store original file size
        design.setOriginalFileSize((long) image.getBytes().length);
        
        // Get original dimensions
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(image.getBytes()));
        if (originalImage != null) {
            design.setOriginalWidth(originalImage.getWidth());
            design.setOriginalHeight(originalImage.getHeight());
        }
        
        // Compress the image
        byte[] compressedData = imageCompressionService.compressImage(image);
        design.setImageData(compressedData);
        design.setImageType(imageCompressionService.getCompressedContentType(image.getContentType()));
        
        // Store compressed file size
        design.setCompressedFileSize((long) compressedData.length);
        
        // Calculate compression ratio
        if (design.getOriginalFileSize() != null && design.getOriginalFileSize() > 0) {
            double ratio = (double) design.getCompressedFileSize() / design.getOriginalFileSize();
            design.setCompressionRatio(String.format("%.2f%%", (1 - ratio) * 100));
        }
        
        // Get compressed dimensions
        BufferedImage compressedImage = ImageIO.read(new ByteArrayInputStream(compressedData));
        if (compressedImage != null) {
            design.setCompressedWidth(compressedImage.getWidth());
            design.setCompressedHeight(compressedImage.getHeight());
        }
        
        // Generate thumbnail
        byte[] thumbnailData = imageCompressionService.generateThumbnail(compressedData, 200);
        design.setThumbnailData(thumbnailData);
        design.setThumbnailType("image/jpeg");
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

    // Debug endpoint to regenerate thumbnails for all designs
    @PostMapping("/regenerate-thumbnails")
    public ResponseEntity<String> regenerateThumbnails() {
        try {
            List<Design> designs = designService.getAllDesigns();
            int updatedCount = 0;
            
            for (Design design : designs) {
                if (design.getImageData() != null) {
                    try {
                        // Generate thumbnail from existing image data
                        byte[] thumbnailData = imageCompressionService.generateThumbnail(design.getImageData(), 200);
                        design.setThumbnailData(thumbnailData);
                        design.setThumbnailType("image/jpeg");
                        designService.createDesign(design); // This will update the existing design
                        updatedCount++;
                    } catch (Exception e) {
                        System.err.println("Error generating thumbnail for design " + design.getId() + ": " + e.getMessage());
                    }
                }
            }
            
            return ResponseEntity.ok("Regenerated thumbnails for " + updatedCount + " designs");
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error regenerating thumbnails: " + e.getMessage());
        }
    }
} 
package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.service.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/designs")
public class DesignController {
    @Autowired
    private DesignService designService;

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
                    design.setImageData(image.getBytes());
                    design.setImageType(image.getContentType());
                } catch (IOException e) {
                    return ResponseEntity.badRequest().body("Failed to read image");
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
            design.setImageData(image.getBytes());
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
} 
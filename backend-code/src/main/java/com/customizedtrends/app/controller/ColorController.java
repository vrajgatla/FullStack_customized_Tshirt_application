package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.service.ColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colors")
public class ColorController {
    @Autowired
    private ColorService colorService;

    @GetMapping
    public List<Color> getAllColors() {
        return colorService.getAllColors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Color> getColorById(@PathVariable Long id) {
        return colorService.getColorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Color> createColor(@RequestBody Color color) {
        if (color.getName() == null || color.getName().trim().isEmpty()) {
            throw new RuntimeException("Color name cannot be empty");
        }
        if (color.getHexCode() == null || color.getHexCode().trim().isEmpty()) {
            throw new RuntimeException("Color hex code cannot be empty");
        }
        if (colorService.findColorByName(color.getName()).isPresent()) {
            throw new RuntimeException("Color already exists: " + color.getName());
        }
        return ResponseEntity.ok(colorService.createColor(color));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Color> updateColor(@PathVariable Long id, @RequestBody Color color) {
        try {
            return ResponseEntity.ok(colorService.updateColor(id, color));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColor(@PathVariable Long id) {
        colorService.deleteColor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        // This is a stub. Replace with real category logic if you have a Category entity.
        return java.util.List.of("Men", "Women", "Kids", "Sports", "Trendy");
    }

    @GetMapping("/used")
    public List<Color> getColorsUsedByTshirts() {
        return colorService.getColorsUsedByTshirts();
    }
} 
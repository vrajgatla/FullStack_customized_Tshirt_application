package com.customizedtrends.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import com.customizedtrends.app.service.TshirtService;
import com.customizedtrends.app.service.DesignService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private TshirtService tshirtService;
    @Autowired
    private DesignService designService;

    @GetMapping
    public List<Map<String, Object>> getCategories() {
        List<Map<String, Object>> categories = new java.util.ArrayList<>();
        var tshirts = tshirtService.getAllTshirts();
        if (!tshirts.isEmpty()) {
            var sampleTshirt = tshirts.get(0);
            categories.add(Map.of(
                "id", sampleTshirt.getId(),
                "name", "T-Shirts",
                "image", "/api/tshirts/" + sampleTshirt.getId() + "/image"
            ));
        }
        var designs = designService.getAllDesigns();
        if (!designs.isEmpty()) {
            var sampleDesign = designs.get(0);
            categories.add(Map.of(
                "id", sampleDesign.getId(),
                "name", "Designs",
                "image", "/api/designs/" + sampleDesign.getId() + "/image"
            ));
        }
        return categories;
    }
} 
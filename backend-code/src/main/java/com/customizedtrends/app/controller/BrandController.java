package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {
    @Autowired
    private BrandService brandService;

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        return brandService.getBrandById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        if (brand.getName() == null || brand.getName().trim().isEmpty()) {
            throw new RuntimeException("Brand name cannot be empty");
        }
        if (brandService.findBrandByName(brand.getName()).isPresent()) {
            throw new RuntimeException("Brand already exists: " + brand.getName());
        }
        return ResponseEntity.ok(brandService.createBrand(brand));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody Brand brand) {
        try {
            return ResponseEntity.ok(brandService.updateBrand(id, brand));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/used")
    public List<Brand> getBrandsUsedByTshirts() {
        return brandService.getBrandsUsedByTshirts();
    }
} 
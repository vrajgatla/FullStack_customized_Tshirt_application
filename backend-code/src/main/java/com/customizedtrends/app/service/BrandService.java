package com.customizedtrends.app.service;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Optional<Brand> getBrandById(Long id) {
        return brandRepository.findById(id);
    }

    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Long id, Brand updatedBrand) {
        return brandRepository.findById(id)
            .map(brand -> {
                brand.setName(updatedBrand.getName());
                return brandRepository.save(brand);
            })
            .orElseThrow(() -> new RuntimeException("Brand not found"));
    }

    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }

    public Optional<Brand> findBrandByName(String name) {
        return brandRepository.findByName(name);
    }

    public List<Brand> getBrandsUsedByTshirts() {
        return brandRepository.findBrandsUsedByTshirts();
    }
} 
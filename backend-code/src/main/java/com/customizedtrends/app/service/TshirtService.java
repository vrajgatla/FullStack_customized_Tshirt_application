package com.customizedtrends.app.service;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Tshirt;
import com.customizedtrends.app.repository.TshirtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TshirtService {
    @Autowired
    private TshirtRepository tshirtRepository;

    public List<Tshirt> getAllTshirts() {
        return tshirtRepository.findAll();
    }

    public Optional<Tshirt> getTshirtById(Long id) {
        return tshirtRepository.findById(id);
    }

    public Tshirt createTshirt(Tshirt tshirt) {
        return tshirtRepository.save(tshirt);
    }

    public Tshirt updateTshirt(Long id, Tshirt updatedTshirt) {
        return tshirtRepository.findById(id)
            .map(tshirt -> {
                tshirt.setBrand(updatedTshirt.getBrand());
                tshirt.setColor(updatedTshirt.getColor());
                tshirt.setSizes(updatedTshirt.getSizes());
                tshirt.setGender(updatedTshirt.getGender());
                tshirt.setMaterial(updatedTshirt.getMaterial());
                tshirt.setFit(updatedTshirt.getFit());
                tshirt.setSleeveType(updatedTshirt.getSleeveType());
                tshirt.setNeckType(updatedTshirt.getNeckType());
                tshirt.setPrice(updatedTshirt.getPrice());
                tshirt.setStock(updatedTshirt.getStock());
                tshirt.setFeatured(updatedTshirt.getFeatured());
                tshirt.setTags(updatedTshirt.getTags());
                tshirt.setDescription(updatedTshirt.getDescription());
                return tshirtRepository.save(tshirt);
            })
            .orElseThrow(() -> new RuntimeException("Tshirt not found"));
    }

    public void deleteTshirt(Long id) {
        tshirtRepository.deleteById(id);
    }

    public Page<Tshirt> getAllTshirts(Pageable pageable) {
        return tshirtRepository.findAll(pageable);
    }
    
    public Optional<Tshirt> findByBrandAndColor(Brand brand, Color color) {
        return tshirtRepository.findByBrandAndColor(brand, color);
    }
    
    public Optional<Tshirt> findByBrandColorAndGender(Brand brand, Color color, String gender) {
        return tshirtRepository.findByBrandAndColorAndGender(brand, color, gender);
    }
    
    public Page<Tshirt> searchTshirts(String query, Pageable pageable) {
        return tshirtRepository.searchTshirts(query, pageable);
    }
    
    public Page<Tshirt> filterTshirts(String brand, String color, String gender, Pageable pageable) {
        return tshirtRepository.filterTshirts(brand, color, gender, pageable);
    }
    
    public Page<Tshirt> getTshirtsWithFilters(String search, String brand, String color, String gender, Pageable pageable) {
        if (!search.isEmpty()) {
            return searchTshirts(search, pageable);
        } else if (!brand.isEmpty() || !color.isEmpty() || !gender.isEmpty()) {
            return filterTshirts(brand, color, gender, pageable);
        } else {
            return getAllTshirts(pageable);
        }
    }

    // Get available colors for a specific brand
    public List<Color> getAvailableColorsByBrand(String brandName) {
        return tshirtRepository.findAvailableColorsByBrand(brandName);
    }

    // Get available colors for a specific gender
    public List<Color> getAvailableColorsByGender(String gender) {
        return tshirtRepository.findAvailableColorsByGender(gender);
    }

    // Get available colors for a specific brand and gender combination
    public List<Color> getAvailableColorsByBrandAndGender(String brandName, String gender) {
        return tshirtRepository.findAvailableColorsByBrandAndGender(brandName, gender);
    }

    // Get all colors that have t-shirts
    public List<Color> getAllAvailableColors() {
        return tshirtRepository.findAllAvailableColors();
    }

    // Get available brands for a specific gender
    public List<Brand> getAvailableBrandsByGender(String gender) {
        return tshirtRepository.findAvailableBrandsByGender(gender);
    }

    // Get all brands that have t-shirts
    public List<Brand> getAllAvailableBrands() {
        return tshirtRepository.findAllAvailableBrands();
    }
} 
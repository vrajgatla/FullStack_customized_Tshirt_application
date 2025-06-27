package com.customizedtrends.app.service;

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
} 
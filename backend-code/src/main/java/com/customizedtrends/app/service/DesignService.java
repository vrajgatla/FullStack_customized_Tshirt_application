package com.customizedtrends.app.service;

import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.repository.DesignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesignService {
    @Autowired
    private DesignRepository designRepository;

    public List<Design> getAllDesigns() {
        return designRepository.findAll();
    }

    public Optional<Design> getDesignById(Long id) {
        return designRepository.findById(id);
    }

    public Design createDesign(Design design) {
        return designRepository.save(design);
    }

    public Design updateDesign(Long id, Design updatedDesign) {
        return designRepository.findById(id)
            .map(design -> {
                design.setName(updatedDesign.getName());
                design.setType(updatedDesign.getType());
                design.setTheme(updatedDesign.getTheme());
                design.setTags(updatedDesign.getTags());
                design.setUploadedBy(updatedDesign.getUploadedBy());
                design.setDate(updatedDesign.getDate());
                design.setImageUrl(updatedDesign.getImageUrl());
                design.setThumbnailUrl(updatedDesign.getThumbnailUrl());
                design.setOptimizedUrl(updatedDesign.getOptimizedUrl());
                design.setImageType(updatedDesign.getImageType());
                design.setDescription(updatedDesign.getDescription());
                design.setCloudinaryPublicId(updatedDesign.getCloudinaryPublicId());
                design.setCloudinaryVersion(updatedDesign.getCloudinaryVersion());
                return designRepository.save(design);
            })
            .orElseThrow(() -> new RuntimeException("Design not found"));
    }

    public void deleteDesign(Long id) {
        designRepository.deleteById(id);
    }

    public Page<Design> getAllDesigns(Pageable pageable) {
        return designRepository.findAll(pageable);
    }
} 
package com.customizedtrends.app.service;

import com.customizedtrends.app.model.Design;
import com.customizedtrends.app.model.DesignedTshirt;
import com.customizedtrends.app.model.OrderItem;
import com.customizedtrends.app.repository.DesignRepository;
import com.customizedtrends.app.repository.DesignedTshirtRepository;
import com.customizedtrends.app.repository.OrderItemRepository;
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
    
    @Autowired
    private DesignedTshirtRepository designedTshirtRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

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
        // Check if design exists
        Design design = designRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Design not found with id: " + id));
        
        // Check for references in DesignedTshirt (both active and inactive)
        List<DesignedTshirt> designedTshirts = designedTshirtRepository.findByDesignIdAndIsActiveTrue(id);
        if (!designedTshirts.isEmpty()) {
            throw new RuntimeException("Cannot delete design. It is referenced by " + designedTshirts.size() + " active designed t-shirt(s). Please remove these references first.");
        }
        
        // Also check for any DesignedTshirt references regardless of active status
        List<DesignedTshirt> allDesignedTshirts = designedTshirtRepository.findByDesignId(id);
        if (!allDesignedTshirts.isEmpty()) {
            throw new RuntimeException("Cannot delete design. It is referenced by " + allDesignedTshirts.size() + " designed t-shirt(s) (including inactive). Please remove these references first.");
        }
        
        // Check for references in OrderItem
        List<OrderItem> orderItems = orderItemRepository.findByDesignId(id);
        if (!orderItems.isEmpty()) {
            throw new RuntimeException("Cannot delete design. It is referenced by " + orderItems.size() + " order item(s). Please remove these references first.");
        }
        
        // If no references found, delete the design
        try {
            designRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete design: " + e.getMessage() + ". This might be due to database constraints.");
        }
    }

    public Page<Design> getAllDesigns(Pageable pageable) {
        return designRepository.findAll(pageable);
    }
    
    public boolean canDeleteDesign(Long id) {
        // Check if design exists
        if (!designRepository.existsById(id)) {
            return false;
        }
        
        // Check for any references
        List<DesignedTshirt> designedTshirts = designedTshirtRepository.findByDesignId(id);
        List<OrderItem> orderItems = orderItemRepository.findByDesignId(id);
        
        return designedTshirts.isEmpty() && orderItems.isEmpty();
    }
    
    public void forceDeleteDesign(Long id) {
        // Check if design exists
        Design design = designRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Design not found with id: " + id));
        
        // Remove all DesignedTshirt references
        List<DesignedTshirt> designedTshirts = designedTshirtRepository.findByDesignId(id);
        if (!designedTshirts.isEmpty()) {
            designedTshirtRepository.deleteAll(designedTshirts);
        }
        
        // Remove all OrderItem references
        List<OrderItem> orderItems = orderItemRepository.findByDesignId(id);
        if (!orderItems.isEmpty()) {
            orderItemRepository.deleteAll(orderItems);
        }
        
        // Now delete the design
        try {
            designRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete design after removing references: " + e.getMessage());
        }
    }
} 
package com.customizedtrends.app.repository;

import com.customizedtrends.app.model.DesignedTshirt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DesignedTshirtRepository extends JpaRepository<DesignedTshirt, Long> {
    
    // Find all active designed t-shirts
    List<DesignedTshirt> findByIsActiveTrue();
    
    // Find all active designed t-shirts with pagination
    Page<DesignedTshirt> findByIsActiveTrue(Pageable pageable);
    
    // Find featured designed t-shirts
    List<DesignedTshirt> findByFeaturedTrueAndIsActiveTrue();
    
    // Search designed t-shirts by name, tags, or description
    @Query("SELECT dt FROM DesignedTshirt dt WHERE dt.isActive = true AND " +
           "(LOWER(dt.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(dt.tags) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(dt.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<DesignedTshirt> searchDesignedTshirts(@Param("search") String search, Pageable pageable);
    
    // Find by brand
    List<DesignedTshirt> findByBrand_NameAndIsActiveTrue(String brandName);
    
    // Find by color
    List<DesignedTshirt> findByColor_NameAndIsActiveTrue(String colorName);
    
    // Find by brand and color
    List<DesignedTshirt> findByBrand_NameAndColor_NameAndIsActiveTrue(String brandName, String colorName);
    
    // Find by gender
    List<DesignedTshirt> findByGenderAndIsActiveTrue(String gender);
    
    // Find by created by (admin)
    List<DesignedTshirt> findByCreatedByAndIsActiveTrue(String createdBy);
    
    // Find by design (if using gallery design)
    List<DesignedTshirt> findByDesignIdAndIsActiveTrue(Long designId);
    
    // Count active designed t-shirts
    long countByIsActiveTrue();
}

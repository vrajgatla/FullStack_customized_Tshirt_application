package com.customizedtrends.app.repository;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Tshirt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TshirtRepository extends JpaRepository<Tshirt, Long> {
    Optional<Tshirt> findByBrandAndColor(Brand brand, Color color);
    
    Optional<Tshirt> findByBrandAndColorAndGender(Brand brand, Color color, String gender);
    
    // Search t-shirts by name, tags, or description
    @Query("SELECT t FROM Tshirt t WHERE " +
           "LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.tags) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Tshirt> searchTshirts(@Param("query") String query, Pageable pageable);
    
    // Filter t-shirts by brand, color, and gender
    @Query("SELECT t FROM Tshirt t WHERE " +
           "(:brand = '' OR t.brand.name = :brand) AND " +
           "(:color = '' OR t.color.name = :color) AND " +
           "(:gender = '' OR t.gender = :gender)")
    Page<Tshirt> filterTshirts(@Param("brand") String brand, 
                               @Param("color") String color, 
                               @Param("gender") String gender, 
                               Pageable pageable);

    // Find available colors for a specific brand
    @Query("SELECT DISTINCT t.color FROM Tshirt t WHERE t.brand.name = :brandName")
    List<Color> findAvailableColorsByBrand(@Param("brandName") String brandName);

    // Find available colors for a specific gender
    @Query("SELECT DISTINCT t.color FROM Tshirt t WHERE t.gender = :gender")
    List<Color> findAvailableColorsByGender(@Param("gender") String gender);

    // Find available colors for a specific brand and gender combination
    @Query("SELECT DISTINCT t.color FROM Tshirt t WHERE t.brand.name = :brandName AND t.gender = :gender")
    List<Color> findAvailableColorsByBrandAndGender(@Param("brandName") String brandName, @Param("gender") String gender);

    // Find all colors that have t-shirts
    @Query("SELECT DISTINCT t.color FROM Tshirt t")
    List<Color> findAllAvailableColors();

    // Find available brands for a specific gender
    @Query("SELECT DISTINCT t.brand FROM Tshirt t WHERE t.gender = :gender")
    List<Brand> findAvailableBrandsByGender(@Param("gender") String gender);

    // Find all brands that have t-shirts
    @Query("SELECT DISTINCT t.brand FROM Tshirt t")
    List<Brand> findAllAvailableBrands();
} 
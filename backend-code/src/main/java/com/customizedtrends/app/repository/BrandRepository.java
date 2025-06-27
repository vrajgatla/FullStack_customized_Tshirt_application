package com.customizedtrends.app.repository;

import com.customizedtrends.app.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByName(String name);

    @Query("SELECT DISTINCT t.brand FROM Tshirt t")
    List<Brand> findBrandsUsedByTshirts();
} 
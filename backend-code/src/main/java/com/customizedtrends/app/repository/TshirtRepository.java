package com.customizedtrends.app.repository;

import com.customizedtrends.app.model.Brand;
import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.model.Tshirt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TshirtRepository extends JpaRepository<Tshirt, Long> {
    Optional<Tshirt> findByBrandAndColor(Brand brand, Color color);
} 
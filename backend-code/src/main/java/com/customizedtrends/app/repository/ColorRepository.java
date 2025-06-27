package com.customizedtrends.app.repository;

import com.customizedtrends.app.model.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ColorRepository extends JpaRepository<Color, Long> {
    Optional<Color> findByName(String name);

    @Query("SELECT DISTINCT t.color FROM Tshirt t")
    List<Color> findColorsUsedByTshirts();
} 
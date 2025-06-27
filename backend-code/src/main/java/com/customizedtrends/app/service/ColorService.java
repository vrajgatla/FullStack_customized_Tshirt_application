package com.customizedtrends.app.service;

import com.customizedtrends.app.model.Color;
import com.customizedtrends.app.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorService {
    @Autowired
    private ColorRepository colorRepository;

    public List<Color> getAllColors() {
        return colorRepository.findAll();
    }

    public Optional<Color> getColorById(Long id) {
        return colorRepository.findById(id);
    }

    public Color createColor(Color color) {
        return colorRepository.save(color);
    }

    public Color updateColor(Long id, Color updatedColor) {
        return colorRepository.findById(id)
            .map(color -> {
                color.setName(updatedColor.getName());
                color.setHexCode(updatedColor.getHexCode());
                return colorRepository.save(color);
            })
            .orElseThrow(() -> new RuntimeException("Color not found"));
    }

    public void deleteColor(Long id) {
        colorRepository.deleteById(id);
    }

    public Optional<Color> findColorByName(String name) {
        return colorRepository.findByName(name);
    }

    public List<Color> getColorsUsedByTshirts() {
        return colorRepository.findColorsUsedByTshirts();
    }
} 
package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.HomePageConfig;
import com.customizedtrends.app.repository.HomePageConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/home-config")
public class HomePageConfigController {
    @Autowired
    private HomePageConfigRepository repo;

    @GetMapping
    public HomePageConfig getConfig() {
        return repo.findAll().stream().findFirst().orElse(null);
    }

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')") // Uncomment if using Spring Security
    public HomePageConfig updateConfig(@RequestBody HomePageConfig config) {
        config.setId(1L); // Always use ID 1 for singleton config
        return repo.save(config);
    }
} 
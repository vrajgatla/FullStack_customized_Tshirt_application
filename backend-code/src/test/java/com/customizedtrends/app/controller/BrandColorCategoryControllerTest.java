package com.customizedtrends.app.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BrandColorCategoryControllerTest {
    @Autowired private MockMvc mockMvc;

    @Test
    void get_all_brands_public() throws Exception {
        mockMvc.perform(get("/api/brands"))
            .andExpect(status().isOk());
    }

    @Test
    void create_brand_requires_auth() throws Exception {
        mockMvc.perform(post("/api/brands")
            .contentType("application/json")
            .content("{\"name\":\"Test Brand\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void get_all_colors_public() throws Exception {
        mockMvc.perform(get("/api/colors"))
            .andExpect(status().isOk());
    }

    @Test
    void get_all_categories_public() throws Exception {
        mockMvc.perform(get("/api/categories"))
            .andExpect(status().isOk());
    }
} 
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
public class DesignControllerTest {
    @Autowired private MockMvc mockMvc;

    @Test
    void get_all_designs_public() throws Exception {
        mockMvc.perform(get("/api/designs"))
            .andExpect(status().isOk());
    }

    @Test
    void create_design_requires_auth() throws Exception {
        mockMvc.perform(post("/api/designs")
            .contentType("application/json")
            .content("{\"name\":\"Test Design\"}"))
            .andExpect(status().isUnauthorized());
    }
} 
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
public class TshirtControllerTest {
    @Autowired private MockMvc mockMvc;

    @Test
    void get_all_tshirts_public() throws Exception {
        mockMvc.perform(get("/api/tshirts"))
            .andExpect(status().isOk());
    }

    @Test
    void create_tshirt_requires_auth() throws Exception {
        mockMvc.perform(post("/api/tshirts")
            .contentType("application/json")
            .content("{\"name\":\"Test Tee\"}"))
            .andExpect(status().isUnauthorized());
    }
} 
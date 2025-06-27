package com.customizedtrends.app.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {
    @Autowired private MockMvc mockMvc;

    @Test
    void signup_and_login_success() throws Exception {
        // Signup
        mockMvc.perform(post("/api/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"testpass\"}"))
            .andExpect(status().isOk());

        // Login
        mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"nameOrEmail\":\"testuser\",\"password\":\"testpass\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void login_wrong_password() throws Exception {
        mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"nameOrEmail\":\"testuser\",\"password\":\"wrongpass\"}"))
            .andExpect(status().isUnauthorized());
    }
} 
package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.User;
import com.customizedtrends.app.service.UserService;
import com.customizedtrends.app.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Valid
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;

    public static class SignupRequest {
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        private String name;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        private String email;
        
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        @NotBlank(message = "Name or email is required")
        private String nameOrEmail;
        
        @NotBlank(message = "Password is required")
        private String password;

        // Getters and setters
        public String getNameOrEmail() { return nameOrEmail; }
        public void setNameOrEmail(String nameOrEmail) { this.nameOrEmail = nameOrEmail; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            logger.info("Signup attempt for email: {}", request.getEmail());
            
            // Check if user already exists
            Optional<User> existingUser = userService.findByNameOrEmail(request.getEmail());
            if (existingUser.isPresent()) {
                logger.warn("Signup failed: Email already exists: {}", request.getEmail());
                return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
            }
            
            User user = userService.registerUser(request.getName(), request.getEmail(), request.getPassword());
            logger.info("User registered successfully: {}", user.getEmail());
            
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
            ));
        } catch (Exception e) {
            logger.error("Signup error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            logger.info("Login attempt for: {}", request.getNameOrEmail());
            
            Optional<User> userOpt = userService.findByNameOrEmail(request.getNameOrEmail());
            if (userOpt.isEmpty()) {
                logger.warn("Login failed: User not found: {}", request.getNameOrEmail());
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
            
            User user = userOpt.get();
            boolean passwordMatch = userService.checkPassword(user, request.getPassword());
            if (!passwordMatch) {
                logger.warn("Login failed: Invalid password for user: {}", request.getNameOrEmail());
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
            
            String token = jwtService.generateToken(user.getId().toString(), user.getRole().toString());
            logger.info("Login successful for user: {} with role: {}", user.getEmail(), user.getRole());
            
            return ResponseEntity.ok(Map.of(
                "token", token, 
                "id", user.getId(),
                "name", user.getName(), 
                "email", user.getEmail(),
                "role", user.getRole().toString()
            ));
        } catch (Exception e) {
            logger.error("Login error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Login failed"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid authorization header"));
            }
            
            String token = authHeader.substring(7);
            String userId = jwtService.extractUsername(token);
            
            if (!jwtService.validateToken(token, userId)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
            }
            
            Optional<User> userOpt = userService.findById(Long.parseLong(userId));
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().toString()
            ));
        } catch (Exception e) {
            logger.error("Profile fetch error: {}", e.getMessage(), e);
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }
} 
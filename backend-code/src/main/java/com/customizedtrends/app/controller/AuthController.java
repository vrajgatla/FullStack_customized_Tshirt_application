package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.User;
import com.customizedtrends.app.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final String JWT_SECRET = "your_jwt_secret_key"; // Use env var in production
    private static final long EXPIRATION_TIME = 86400000; // 1 day

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        if (name == null || email == null || password == null) {
            return ResponseEntity.badRequest().body("Missing fields");
        }
        User user = userService.registerUser(name, email, password);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            logger.info("Login attempt: {}", body);
            String nameOrEmail = body.get("nameOrEmail");
            String password = body.get("password");
            if (nameOrEmail == null || password == null) {
                logger.warn("Missing fields in login: {}", body);
                return ResponseEntity.badRequest().body(Map.of("error", "Missing fields: nameOrEmail and password are required."));
            }
            Optional<User> userOpt = userService.findByNameOrEmail(nameOrEmail);
            logger.info("User lookup result for '{}': {}", nameOrEmail, userOpt.isPresent());
            if (userOpt.isEmpty()) {
                logger.warn("User not found for: {}", nameOrEmail);
                return ResponseEntity.status(404).body(Map.of("error", "User not found with given name or email."));
            }
            User user = userOpt.get();
            boolean passwordMatch = userService.checkPassword(user, password);
            logger.info("Password match for '{}': {}", nameOrEmail, passwordMatch);
            if (!passwordMatch) {
                logger.warn("Invalid password for user: {}", nameOrEmail);
                return ResponseEntity.status(401).body(Map.of("error", "Invalid password."));
            }
            logger.info("Creating JWT for user: {}", nameOrEmail);
            String token = Jwts.builder()
                    .setSubject(user.getId().toString())
                    .claim("name", user.getName())
                    .claim("email", user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .signWith(SignatureAlgorithm.HS256, JWT_SECRET)
                    .compact();
            logger.info("Login successful for user: {}", nameOrEmail);
            return ResponseEntity.ok(Map.of("token", token, "name", user.getName(), "email", user.getEmail()));
        } catch (Exception e) {
            logger.error("Login error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }
} 
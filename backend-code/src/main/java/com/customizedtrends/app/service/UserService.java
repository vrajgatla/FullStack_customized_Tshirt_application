package com.customizedtrends.app.service;

import com.customizedtrends.app.model.User;
import com.customizedtrends.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(String name, String email, String password) {
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(name, email, hashedPassword);
        return userRepository.save(user);
    }

    public Optional<User> findByNameOrEmail(String nameOrEmail) {
        Optional<User> user = userRepository.findByName(nameOrEmail);
        if (user.isEmpty()) {
            user = userRepository.findByEmail(nameOrEmail);
        }
        return user;
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
} 
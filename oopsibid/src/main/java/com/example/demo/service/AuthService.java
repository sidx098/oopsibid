package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================
    // REGISTER
    // ==========================

    public User register(RegisterRequest request) {

        // Check name
        if (request.getName() == null ||
            request.getName().trim().isEmpty()) {

            throw new RuntimeException("Name is required");
        }

        // Check email
        if (request.getEmail() == null ||
            request.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        // Check password
        if (request.getPassword() == null ||
            request.getPassword().isEmpty()) {

            throw new RuntimeException("Password is required");
        }

        // Check role
        if (request.getRole() == null ||
            request.getRole().trim().isEmpty()) {

            throw new RuntimeException("Role is required");
        }

        String role = request.getRole().toUpperCase();

        // Only BUYER and SELLER can register
        if (!role.equals("BUYER") &&
            !role.equals("SELLER")) {

            throw new RuntimeException(
                    "Invalid role. Choose BUYER or SELLER"
            );
        }

        String email =
                request.getEmail().trim().toLowerCase();

        // Check duplicate email
        if (userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Create user
        User user = new User();

        user.setName(request.getName().trim());

        user.setEmail(email);

        // Hash password using BCrypt
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(role);

        user.setStatus("ACTIVE");

        user.setCreatedAt(LocalDateTime.now());

        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }


    // ==========================
    // LOGIN
    // ==========================

    public User login(
            String email,
            String password) {

        if (email == null ||
            email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        if (password == null ||
            password.isEmpty()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }

        email = email.trim().toLowerCase();

        // Find user
        User user =
                userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        // Check account status
        if ("BLOCKED".equalsIgnoreCase(
                user.getStatus())) {

            throw new RuntimeException(
                    "Your account has been blocked"
            );
        }

        // Verify BCrypt password
        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return user;
    }
}
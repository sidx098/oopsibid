package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==========================================
    // GET MY PROFILE
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getProfile(
            Authentication authentication) {

        try {

            // ======================================
            // CHECK LOGIN
            // ======================================

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body("Login required");
            }


            // ======================================
            // GET USER ID FROM JWT
            // ======================================

            String userId =
                    authentication.getName();


            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "PROFILE REQUEST"
            );

            System.out.println(
                    "AUTHENTICATED USER ID: "
                    + userId
            );


            // ======================================
            // CHECK USER ID
            // ======================================

            if (userId == null ||
                userId.trim().isEmpty()) {

                return ResponseEntity
                        .status(401)
                        .body(
                            "Unable to identify user"
                        );
            }


            // ======================================
            // FIND USER
            // ======================================

            Optional<User> userOptional =
                    userRepository.findById(
                            userId.trim()
                    );


            // ======================================
            // USER NOT FOUND
            // ======================================

            if (userOptional.isEmpty()) {

                System.out.println(
                        "USER NOT FOUND: "
                        + userId
                );

                return ResponseEntity
                        .status(404)
                        .body(
                            "User not found"
                        );
            }


            // ======================================
            // USER FOUND
            // ======================================

            User user =
                    userOptional.get();


            System.out.println(
                    "USER FOUND: "
                    + user.getName()
            );


            // ======================================
            // PROFILE RESPONSE
            // ======================================

            Map<String, Object> profile =
                    new HashMap<>();


            profile.put(
                    "id",
                    user.getId()
            );

            profile.put(
                    "name",
                    user.getName()
            );

            profile.put(
                    "email",
                    user.getEmail()
            );

            profile.put(
                    "role",
                    user.getRole()
            );

            profile.put(
                    "status",
                    user.getStatus()
            );

            profile.put(
                    "createdAt",
                    user.getCreatedAt()
            );


            return ResponseEntity.ok(profile);


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to load profile: "
                        + e.getMessage()
                    );
        }
    }
}
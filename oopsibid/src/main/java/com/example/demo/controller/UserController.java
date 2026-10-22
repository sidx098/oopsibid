package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // ==========================================
    // GET LOGGED-IN USER PROFILE
    // ==========================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication) {

        try {

            // ==========================================
            // CHECK AUTHENTICATION
            // ==========================================

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body("Login required");
            }


            // ==========================================
            // GET USER ID FROM JWT
            // ==========================================

            // Your JWT subject currently contains
            // the MongoDB User ID

            String userId =
                    authentication.getName();

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "PROFILE REQUEST"
            );

            System.out.println(
                    "AUTHENTICATION USER ID: ["
                    + userId
                    + "]"
            );


            // ==========================================
            // CHECK USER ID
            // ==========================================

            if (userId == null ||
                userId.trim().isEmpty()) {

                System.out.println(
                        "PROFILE ERROR: USER ID IS EMPTY"
                );

                return ResponseEntity
                        .status(401)
                        .body(
                                "Unable to identify user"
                        );
            }


            String cleanUserId =
                    userId.trim();


            System.out.println(
                    "SEARCHING USER ID: ["
                    + cleanUserId
                    + "]"
            );


            // ==========================================
            // FIND USER BY MONGODB ID
            // ==========================================

            Optional<User> userOptional =
                    userRepository.findById(
                            cleanUserId
                    );


            // ==========================================
            // USER NOT FOUND
            // ==========================================

            if (userOptional.isEmpty()) {

                System.out.println(
                        "USER NOT FOUND IN MONGODB"
                );

                System.out.println(
                        "SEARCHED USER ID: ["
                        + cleanUserId
                        + "]"
                );

                System.out.println(
                        "======================================"
                );

                return ResponseEntity
                        .status(404)
                        .body(
                                "User not found"
                        );
            }


            // ==========================================
            // USER FOUND
            // ==========================================

            User user =
                    userOptional.get();


            System.out.println(
                    "USER FOUND"
            );

            System.out.println(
                    "USER ID: "
                    + user.getId()
            );

            System.out.println(
                    "USER NAME: "
                    + user.getName()
            );

            System.out.println(
                    "USER EMAIL: "
                    + user.getEmail()
            );

            System.out.println(
                    "USER ROLE: "
                    + user.getRole()
            );

            System.out.println(
                    "======================================"
            );


            // ==========================================
            // CREATE RESPONSE
            // ==========================================

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

    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        try {

            if (authentication == null ||
                !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body("Login required");
            }


            String email =
                    authentication.getName();


            if (email == null ||
                email.trim().isEmpty()) {

                return ResponseEntity
                        .status(401)
                        .body("Unable to identify user");
            }


            Optional<User> userOptional =
                    userRepository.findByEmail(
                            email.trim()
                    );


            if (userOptional.isEmpty()) {

                return ResponseEntity
                        .status(404)
                        .body("User not found");
            }


            User user =
                    userOptional.get();


            // --------------------------------------
            // UPDATE NAME
            // --------------------------------------

            String name =
                    request.get("name");


            if (name != null &&
                !name.trim().isEmpty()) {

                user.setName(
                        name.trim()
                );
            }


            user.setUpdatedAt(
                    LocalDateTime.now()
            );


            User updatedUser =
                    userRepository.save(user);


            // --------------------------------------
            // RESPONSE
            // --------------------------------------

            Map<String, Object> profile =
                    new HashMap<>();

            profile.put(
                    "id",
                    updatedUser.getId()
            );

            profile.put(
                    "name",
                    updatedUser.getName()
            );

            profile.put(
                    "email",
                    updatedUser.getEmail()
            );

            profile.put(
                    "role",
                    updatedUser.getRole()
            );

            profile.put(
                    "status",
                    updatedUser.getStatus()
            );

            profile.put(
                    "createdAt",
                    updatedUser.getCreatedAt()
            );


            return ResponseEntity.ok(profile);


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Unable to update profile: "
                        + e.getMessage()
                    );
        }
    }
}
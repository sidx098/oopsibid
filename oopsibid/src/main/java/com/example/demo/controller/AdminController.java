package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // GET ALL USERS
    // =========================

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {

        try {

            List<User> users =
                    userRepository.findAll();

            return ResponseEntity.ok(users);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Unable to fetch users.");
        }
    }
    
 // =========================
 // BLOCK USER
 // =========================

 @PutMapping("/users/{id}/block")
 public ResponseEntity<?> blockUser(
         @PathVariable String id) {

     try {

         User user =
                 userRepository.findById(id)
                 .orElseThrow(() ->
                         new RuntimeException(
                                 "User not found"
                         )
                 );

         // Prevent blocking an admin
         if ("ADMIN".equalsIgnoreCase(
                 user.getRole())) {

             return ResponseEntity
                     .badRequest()
                     .body(
                         "Admin account cannot be blocked."
                     );
         }

         user.setStatus("BLOCKED");

         user.setUpdatedAt(
                 java.time.LocalDateTime.now()
         );

         userRepository.save(user);

         return ResponseEntity.ok(
                 "User blocked successfully."
         );

     } catch (RuntimeException e) {

         return ResponseEntity
                 .badRequest()
                 .body(e.getMessage());
     }
 }


 // =========================
 // UNBLOCK USER
 // =========================

 @PutMapping("/users/{id}/unblock")
 public ResponseEntity<?> unblockUser(
         @PathVariable String id) {

     try {

         User user =
                 userRepository.findById(id)
                 .orElseThrow(() ->
                         new RuntimeException(
                                 "User not found"
                         )
                 );

         user.setStatus("ACTIVE");

         user.setUpdatedAt(
                 java.time.LocalDateTime.now()
         );

         userRepository.save(user);

         return ResponseEntity.ok(
                 "User unblocked successfully."
         );

     } catch (RuntimeException e) {

         return ResponseEntity
                 .badRequest()
                 .body(e.getMessage());
     }
 }
}
package com.example.demo.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@oopsibid.com";

            // Check whether admin already exists
            if (userRepository.existsByEmail(adminEmail)) {

                System.out.println(
                    "OOPSIBID Admin account already exists."
                );

                return;
            }

            User admin = new User();

            admin.setName("OOPSIBID Administrator");

            admin.setEmail(adminEmail);

            // Password: Admin@12345
            admin.setPassword(
                passwordEncoder.encode("Admin@12345")
            );

            admin.setRole("ADMIN");

            admin.setStatus("ACTIVE");

            admin.setCreatedAt(
                LocalDateTime.now()
            );

            admin.setUpdatedAt(
                LocalDateTime.now()
            );

            userRepository.save(admin);

            System.out.println(
                "===================================="
            );

            System.out.println(
                "OOPSIBID ADMIN ACCOUNT CREATED"
            );

            System.out.println(
                "Email: admin@oopsibid.com"
            );

            System.out.println(
                "Password: Admin@12345"
            );

            System.out.println(
                "Role: ADMIN"
            );

            System.out.println(
                "===================================="
            );
        };
    }
}
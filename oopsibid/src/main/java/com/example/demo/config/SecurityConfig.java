package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // =====================================
            // CSRF
            // =====================================

            .csrf(csrf -> csrf.disable())


            // =====================================
            // CORS
            // =====================================

            .cors(cors -> {})


            // =====================================
            // AUTHORIZATION
            // =====================================

            .authorizeHttpRequests(auth -> auth


                // =================================
                // PUBLIC
                // =================================

                .requestMatchers(

                    "/",

                    "/test-register.html",
                    "/register.html",
                    "/login.html",
                    "/jwt-test.html",
                    "/product-test.html",
                    "/auction-test.html",

                    "/api/auth/register",
                    "/api/auth/login",

                    // Product browsing
                    "/api/products",

                    // Auction browsing
                    "/api/auctions",
                    "/api/auctions/active"

                )
                .permitAll()


                // =================================
                // ADMIN
                // =================================

                .requestMatchers(
                    "/api/admin/**"
                )
                .hasAuthority("ROLE_ADMIN")


                // =================================
                // SELLER BIDS
                // =================================

                .requestMatchers(
                    "/api/bids/seller"
                )
                .hasAuthority("ROLE_SELLER")


                // =================================
                // PROFILE
                // SELLER + BUYER
                // =================================

                .requestMatchers(
                    "/api/users/profile"
                )
                .hasAnyAuthority(
                    "ROLE_SELLER",
                    "ROLE_BUYER"
                )


                // =================================
                // EVERYTHING ELSE
                // =================================

                .anyRequest()
                .authenticated()
            )


            // =====================================
            // JWT FILTER
            // =====================================

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }


    // ==========================================
    // CORS CONFIGURATION
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                List.of(
                    "http://localhost:5173"
                )
        );


        configuration.setAllowedMethods(
                List.of(
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of("*")
        );


        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}
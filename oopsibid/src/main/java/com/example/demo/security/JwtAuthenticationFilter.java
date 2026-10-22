package com.example.demo.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header =
                request.getHeader("Authorization");

        System.out.println(
                "======================================"
        );

        System.out.println(
                "REQUEST: "
                + request.getMethod()
                + " "
                + request.getRequestURI()
        );

        System.out.println(
                "AUTH HEADER: "
                + header
        );

        if (header == null ||
            !header.startsWith("Bearer ")) {

            System.out.println(
                    "NO JWT TOKEN"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                header.substring(7);

        try {

            // ==========================================
            // EXTRACT USER ID FROM JWT
            // ==========================================

            String userId =
                    jwtService.extractUserId(token);

            // ==========================================
            // EXTRACT EMAIL
            // ==========================================

            String email =
                    jwtService.extractEmail(token);

            // ==========================================
            // EXTRACT ROLE
            // ==========================================

            String role =
                    jwtService.extractRole(token);

            System.out.println(
                    "JWT USER ID: "
                    + userId
            );

            System.out.println(
                    "JWT EMAIL: "
                    + email
            );

            System.out.println(
                    "JWT ROLE: "
                    + role
            );

            // ==========================================
            // CREATE AUTHENTICATION
            // ==========================================

            if (userId != null &&
                !userId.trim().isEmpty() &&
                role != null &&
                SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                String authority =
                        "ROLE_"
                        + role.trim().toUpperCase();

                System.out.println(
                        "CREATED AUTHORITY: "
                        + authority
                );

                /*
                 * IMPORTANT:
                 *
                 * userId is the principal.
                 *
                 * Therefore:
                 *
                 * authentication.getName()
                 *
                 * will return userId.
                 */

                UsernamePasswordAuthenticationToken authentication =

                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.singletonList(
                                        new SimpleGrantedAuthority(
                                                authority
                                        )
                                )
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );

                System.out.println(
                        "AUTHENTICATION SET SUCCESSFULLY"
                );

            }

        } catch (Exception e) {

            System.out.println(
                    "JWT ERROR: "
                    + e.getMessage()
            );
        }

        System.out.println(
                "======================================"
        );

        filterChain.doFilter(
                request,
                response
        );
    }
}
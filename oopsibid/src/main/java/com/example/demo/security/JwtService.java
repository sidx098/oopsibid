package com.example.demo.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final String SECRET_KEY =
            "OOPSIBID_SECRET_KEY_2026_THIS_IS_MY_SECRET_KEY_123456";

    private final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes()
        );
    }

    // ==========================
    // GENERATE TOKEN
    // ==========================

    public String generateToken(
            String userId,
            String email,
            String role) {

        Date now = new Date();

        Date expiry =
                new Date(
                        now.getTime()
                                + EXPIRATION_TIME
                );

        return Jwts.builder()

                // USER ID becomes JWT subject
                .subject(userId)

                // Email stored separately
                .claim("email", email)

                // Role stored separately
                .claim("role", role)

                .issuedAt(now)

                .expiration(expiry)

                .signWith(getSigningKey())

                .compact();
    }

    // ==========================
    // EXTRACT USER ID
    // ==========================

    public String extractUserId(String token) {

        return getClaims(token)
                .getSubject();
    }

    // ==========================
    // EXTRACT EMAIL
    // ==========================

    public String extractEmail(String token) {

        return getClaims(token)
                .get("email", String.class);
    }

    // ==========================
    // EXTRACT ROLE
    // ==========================

    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }

    // ==========================
    // GET CLAIMS
    // ==========================

    private Claims getClaims(String token) {

        return Jwts.parser()

                .verifyWith(getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}
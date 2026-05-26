package com.clinic.backend.infrastructure.security;

import com.clinic.backend.core.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expiration:900000}")
    private long accessExp;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExp;

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("role", user.getRole())       // lưu "admin" / "dentist" / ...javabuilder.online
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .setExpiration(new Date(System.currentTimeMillis() + accessExp))
                .signWith(getKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExp))
                .signWith(getKey())
                .compact();
    }

    public String extractUserId(String token) {
        return extractClaims(token).getSubject();
    }

    /**
     * Lấy role từ claims – tránh query DB trong JwtFilter
     * Role được lưu dạng lowercase: "admin", "dentist", "receptionist", "patient"
     */
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean validate(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // package-private để JwtFilter dùng nếu cần thêm claims
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
package com.clinic.backend.module.security;

import com.clinic.backend.module.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 🔥 phải >= 32 ký tự
    private final String SECRET = "my-super-secret-key-my-super-secret-key";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    private final long ACCESS_EXP = 1000 * 60 * 15;
    private final long REFRESH_EXP = 1000L * 60 * 60 * 24 * 7;

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("role", user.getRole())
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXP))
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXP))
                .signWith(key)
                .compact();
    }

    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validate(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
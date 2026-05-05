package com.clinic.backend.common.security;

import com.clinic.backend.module.user.entity.User;
import com.clinic.backend.module.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        // ===================== SKIP OPTIONS =====================
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        System.out.println("\n==============================");
        System.out.println("🔵 REQUEST: " + request.getMethod() + " " + request.getRequestURI());

        // ===================== GET TOKEN =====================
        String header = request.getHeader("Authorization");
        System.out.println("🔵 AUTH HEADER: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("❌ NO BEARER TOKEN → SKIP AUTH");
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        System.out.println("🔵 TOKEN: " + token);

        // ===================== VALIDATE TOKEN =====================
        boolean valid = jwtService.validate(token);
        System.out.println("🔵 TOKEN VALID: " + valid);

        if (!valid) {
            System.out.println("❌ INVALID TOKEN → SKIP AUTH");
            chain.doFilter(request, response);
            return;
        }

        // ===================== EXTRACT USER ID (UUID FIX) =====================
        String userIdStr = jwtService.extractUserId(token);
        System.out.println("🔵 USER ID STRING: " + userIdStr);

        UUID userId;
        try {
            userId = UUID.fromString(userIdStr);
        } catch (Exception e) {
            System.out.println("❌ INVALID UUID FORMAT");
            chain.doFilter(request, response);
            return;
        }

        // ===================== FIND USER =====================
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            System.out.println("❌ USER NOT FOUND");
            chain.doFilter(request, response);
            return;
        }

        // ===================== ROLE =====================
        String role = user.getRole().trim().toUpperCase();

        System.out.println("🟡 DB ROLE RAW: [" + user.getRole() + "]");
        System.out.println("🟡 ROLE NORMALIZED: [" + role + "]");

        var authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + role)
        );

        System.out.println("🟢 AUTHORITIES: " + authorities);

        // ===================== AUTH CONTEXT =====================
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(auth);

        System.out.println("🟢 AUTH SET SUCCESS");
        System.out.println("🟢 SECURITY CONTEXT: " +
                SecurityContextHolder.getContext().getAuthentication());

        chain.doFilter(request, response);
    }
}
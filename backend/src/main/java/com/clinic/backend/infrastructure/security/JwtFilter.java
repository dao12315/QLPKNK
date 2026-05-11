package com.clinic.backend.infrastructure.security;

import com.clinic.backend.core.domain.model.User;
import com.clinic.backend.core.domain.repository.UserRepository;
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

        String path = request.getRequestURI();
        String method = request.getMethod();

        // ===================== SKIP OPTIONS =====================
        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        // ===================== PUBLIC BYPASS =====================
        if (path.startsWith("/api/auth")
                || (method.equalsIgnoreCase("POST") && path.contains("/api/patients/create")))
        {

            chain.doFilter(request, response);
            return;
        }

        System.out.println("\n==============================");
        System.out.println("🔵 REQUEST: " + method + " " + path);

        // ===================== GET TOKEN =====================
        String header = request.getHeader("Authorization");
        System.out.println("🔵 AUTH HEADER: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        // ===================== VALIDATE TOKEN =====================
        boolean valid = jwtService.validate(token);

        if (!valid) {
            System.out.println("❌ INVALID TOKEN");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or missing token");
            return;
        }

        // ===================== EXTRACT USER ID =====================
        String userIdStr = jwtService.extractUserId(token);

        UUID userId;

        try {
            userId = UUID.fromString(userIdStr);
        } catch (Exception e) {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token format");

            return;
        }

        // ===================== FIND USER =====================
            User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("User not found");
            return;
        }

        // ===================== ROLE =====================
        String role = user.getRole().trim().toLowerCase();

        var authorities = List.of(
                new SimpleGrantedAuthority(role)
        );

        // ===================== SET SECURITY CONTEXT =====================
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(auth);

        chain.doFilter(request, response);
    }
}
package com.clinic.backend.module.security;

import com.clinic.backend.module.entity.User;
import com.clinic.backend.module.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        System.out.println("\n==============================");
        System.out.println("🔵 REQUEST: " + request.getMethod() + " " + request.getRequestURI());

        String header = request.getHeader("Authorization");
        System.out.println("🔵 AUTH HEADER: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("❌ NO BEARER TOKEN → SKIP AUTH");
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        System.out.println("🔵 TOKEN: " + token);

        boolean valid = jwtService.validate(token);
        System.out.println("🔵 TOKEN VALID: " + valid);

        if (!valid) {
            System.out.println("❌ INVALID TOKEN → SKIP AUTH");
            chain.doFilter(request, response);
            return;
        }

        String userId = jwtService.extractUserId(token);
        System.out.println("🔵 USER ID: " + userId);

        User user = userRepository.findById(Integer.parseInt(userId)).orElse(null);

        if (user == null) {
            System.out.println("❌ USER NOT FOUND");
            chain.doFilter(request, response);
            return;
        }

        System.out.println("🟡 DB ROLE RAW: [" + user.getRole() + "]");
        System.out.println("🟡 ROLE NORMALIZED: [" + user.getRole().trim().toLowerCase() + "]");

        var authorities = List.of(
                new SimpleGrantedAuthority(user.getRole().trim().toLowerCase())
        );

        System.out.println("🟢 AUTHORITIES: " + authorities);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(auth);

        System.out.println("🟢 AUTH SET SUCCESS");
        System.out.println("🟢 SECURITY CONTEXT: " +
                SecurityContextHolder.getContext().getAuthentication());

        chain.doFilter(request, response);
    }
}
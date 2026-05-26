package com.clinic.backend.web.controller;

import com.clinic.backend.core.service.AuthService;
import com.clinic.backend.web.dto.LoginRequest;
import com.clinic.backend.web.dto.RefreshRequest;
import com.clinic.backend.web.dto.TokenResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody RefreshRequest req) {
        return authService.refresh(req.getRefreshToken());
    }

    @PostMapping("/logout")
    public void logout(@RequestBody RefreshRequest req) {
        authService.logout(req.getRefreshToken());
    }

    @GetMapping("/me")
    public Object me(Authentication authentication) {
        String userId = authentication.getName();
        return authService.me(userId);
    }
}
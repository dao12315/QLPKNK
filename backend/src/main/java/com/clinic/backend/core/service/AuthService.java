package com.clinic.backend.core.service;

import com.clinic.backend.core.domain.model.RefreshToken;
import com.clinic.backend.core.domain.model.User;
import com.clinic.backend.web.dto.LoginRequest;
import com.clinic.backend.web.dto.TokenResponse;
import com.clinic.backend.web.dto.UserResponse;
import com.clinic.backend.core.domain.repository.RefreshTokenRepository;
import com.clinic.backend.core.domain.repository.UserRepository;
import com.clinic.backend.infrastructure.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;

import static javax.management.Query.plus;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String access = jwtService.generateAccessToken(user);
        String refresh = jwtService.generateRefreshToken(user);

        saveRefreshToken(user, refresh);

        // Map sang cấu trúc mới
        return new TokenResponse(
                access,
                refresh,
                convertToUserResponse(user)
        );
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        RefreshToken token = refreshRepo.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (!jwtService.validate(refreshToken)) {
            throw new RuntimeException("Invalid JWT");
        }

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshRepo.delete(token);
            throw new RuntimeException("Expired token");
        }

        User user = token.getUser();
        refreshRepo.delete(token); // Rotate token

        String newAccess = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);

        saveRefreshToken(user, newRefresh);

        return new TokenResponse(
                newAccess,
                newRefresh,
                convertToUserResponse(user)
        );
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshRepo.deleteByToken(refreshToken);
    }

    // Hàm bổ trợ để tránh lặp code (Helper methods)
    private void saveRefreshToken(User user, String token) {
        RefreshToken refreshTokenEntity = new RefreshToken();

        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setToken(token);
        refreshTokenEntity.setExpiryDate(
                Instant.now().plusSeconds(604800)
        );

        refreshTokenEntity.setCreatedAt(Instant.now());

        refreshRepo.save(refreshTokenEntity);
    }

    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
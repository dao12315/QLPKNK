package com.clinic.backend.core.service;

import com.clinic.backend.core.domain.model.RefreshToken;
import com.clinic.backend.core.domain.model.User;
import com.clinic.backend.core.domain.repository.RefreshTokenRepository;
import com.clinic.backend.core.domain.repository.UserRepository;
import com.clinic.backend.infrastructure.security.JwtService;
import com.clinic.backend.web.dto.LoginRequest;
import com.clinic.backend.web.dto.TokenResponse;
import com.clinic.backend.web.dto.UserResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor  // constructor injection, không dùng @Autowired field
public class AuthService {

    private final UserRepository       userRepository;
    private final RefreshTokenRepository refreshRepo;
    private final JwtService           jwtService;
    private final PasswordEncoder      passwordEncoder;

    // Đồng bộ với jwt.refresh-expiration trong application.properties
    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpMs;

    // ─── Login ────────────────────────────────────────────────
    @Transactional  // đảm bảo generate token và lưu DB là một transaction
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
            // BadCredentialsException → GlobalExceptionHandler map sang 401
        }

        if (!"active".equals(user.getStatus())) {
            throw new IllegalStateException("Account is " + user.getStatus());
        }

        String accessToken  = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveRefreshToken(user, refreshToken);

        return new TokenResponse(accessToken, refreshToken, toUserResponse(user));
    }

    // ─── Refresh ──────────────────────────────────────────────
    @Transactional
    public TokenResponse refresh(String refreshToken) {

        // 1. Validate chữ ký JWT TRƯỚC – tránh query DB với token rác
        if (!jwtService.validate(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        // 2. Tìm trong DB – đảm bảo token chưa bị revoke (logout / đổi pass)
        RefreshToken stored = refreshRepo.findByToken(refreshToken)
                .orElseThrow(() -> new BadCredentialsException("Refresh token not found"));

        // 3. Kiểm tra expiry trong DB (double-check với JWT expiry)
        if (stored.getExpiryDate().isBefore(Instant.now())) {
            refreshRepo.delete(stored);
            throw new BadCredentialsException("Refresh token expired");
        }

        User user = stored.getUser();

        // 4. Rotate: xoá token cũ, cấp token mới
        refreshRepo.delete(stored);

        String newAccess  = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);

        saveRefreshToken(user, newRefresh);

        return new TokenResponse(newAccess, newRefresh, toUserResponse(user));
    }

    // ─── Logout ───────────────────────────────────────────────
    @Transactional
    public void logout(String refreshToken) {
        // Không throw nếu token không tồn tại – idempotent
        refreshRepo.findByToken(refreshToken)
                .ifPresent(refreshRepo::delete);
    }

    // ─── Helpers ─────────────────────────────────────────────
    private void saveRefreshToken(User user, String token) {
        RefreshToken entity = new RefreshToken();
        entity.setUser(user);
        entity.setToken(token);
        entity.setExpiryDate(Instant.now().plusMillis(refreshExpMs)); // đồng bộ với JwtService
        entity.setCreatedAt(Instant.now());
        refreshRepo.save(entity);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
    @Transactional(readOnly = true)
    public UserResponse me(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return toUserResponse(user);
    }
}
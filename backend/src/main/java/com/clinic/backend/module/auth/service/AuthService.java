package com.clinic.backend.module.auth.service;

import com.clinic.backend.module.user.dto.LoginRequest;
import com.clinic.backend.module.user.dto.TokenResponse;
import com.clinic.backend.module.user.entity.RefreshToken;
import com.clinic.backend.module.user.entity.User;
import com.clinic.backend.module.user.repository.RefreshTokenRepository;
import com.clinic.backend.module.user.repository.UserRepository;
import com.clinic.backend.module.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

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

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(refresh);
        token.setExpiryDate(LocalDateTime.now().plusDays(7));

        refreshRepo.save(token);

        return new TokenResponse(
                access,
                refresh,
                user.getEmail(),
                user.getName(),
                user.getRole()
        );
    }

    public TokenResponse refresh(String refreshToken) {

        RefreshToken token = refreshRepo.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (!jwtService.validate(refreshToken)) {
            throw new RuntimeException("Invalid JWT");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshRepo.delete(token);
            throw new RuntimeException("Expired token");
        }

        User user = token.getUser();

        // rotate refresh token
        refreshRepo.delete(token);

        String newAccess = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);

        RefreshToken newToken = new RefreshToken();
        newToken.setUser(user);
        newToken.setToken(newRefresh);
        newToken.setExpiryDate(LocalDateTime.now().plusDays(7));

        refreshRepo.save(newToken);

        return new TokenResponse(
                newAccess,
                newRefresh,
                user.getEmail(),
                user.getName(),
                user.getRole()
        );
    }

    public void logout(String refreshToken) {
        refreshRepo.deleteByToken(refreshToken);
    }
}
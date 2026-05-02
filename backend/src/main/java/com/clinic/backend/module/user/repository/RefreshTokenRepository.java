package com.clinic.backend.module.user.repository;

import com.clinic.backend.common.base.BaseRepository;
import com.clinic.backend.module.user.entity.RefreshToken;
import com.clinic.backend.module.user.entity.User;

import java.util.Optional;

public interface RefreshTokenRepository extends BaseRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
    void deleteByToken(String token);
}
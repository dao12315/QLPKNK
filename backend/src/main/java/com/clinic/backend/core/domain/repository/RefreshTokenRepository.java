package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.common.base.BaseRepository;
import com.clinic.backend.core.domain.model.RefreshToken;
import com.clinic.backend.core.domain.model.User;

import java.util.Optional;

public interface RefreshTokenRepository extends BaseRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);

    void deleteByToken(String token);
}
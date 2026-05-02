package com.clinic.backend.module.user.repository;

import com.clinic.backend.common.base.BaseRepository;
import com.clinic.backend.module.user.entity.User;

import java.util.Optional;

public interface UserRepository extends BaseRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
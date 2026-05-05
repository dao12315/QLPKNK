package com.clinic.backend.module.user.repository;

import com.clinic.backend.common.base.BaseRepository;
import com.clinic.backend.module.user.entity.User;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository
        extends BaseRepository<User, UUID>,
        JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);
}
package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.common.base.BaseRepository;
import com.clinic.backend.core.domain.model.User;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository
        extends BaseRepository<User, UUID>,
        JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);
}
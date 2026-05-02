package com.clinic.backend.module.user.service.impl;

import com.clinic.backend.common.base.BaseServiceImpl;
import com.clinic.backend.module.user.dto.CreateUserRequest;
import com.clinic.backend.module.user.dto.TokenResponse;
import com.clinic.backend.module.user.entity.User;
import com.clinic.backend.module.user.mapper.UserMapper;
import com.clinic.backend.module.user.repository.UserRepository;
import com.clinic.backend.module.user.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl
        extends BaseServiceImpl<User, CreateUserRequest, TokenResponse>
        implements UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserServiceImpl(UserRepository repo,
                           UserMapper mapper,
                           PasswordEncoder encoder) {
        super(repo, mapper);
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public TokenResponse create(CreateUserRequest req) {

        if (repo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email exists");
        }

        User u = mapper.toEntity(req);

        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole(req.getRole().toLowerCase());

        repo.save(u);

        return mapper.toResponse(u);
    }
}
package com.clinic.backend.module.user.mapper;

import com.clinic.backend.common.base.BaseMapper;
import com.clinic.backend.module.user.dto.CreateUserRequest;
import com.clinic.backend.module.user.entity.User;
import com.clinic.backend.module.user.dto.TokenResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper implements BaseMapper<User, CreateUserRequest, TokenResponse> {

    @Override
    public User toEntity(CreateUserRequest req) {
        User u = new User();
        u.setEmail(req.getEmail());
        u.setName(req.getName());
        u.setPassword(req.getPassword());
        u.setRole(req.getRole());
        return u;
    }

    @Override
    public TokenResponse toResponse(User u) {
        return new TokenResponse(
                null,
                null,
                u.getEmail(),
                u.getName(),
                u.getRole()
        );
    }

    @Override
    public List<TokenResponse> toList(List<User> list) {
        return list.stream().map(this::toResponse).toList();
    }

    @Override
    public void update(User u, CreateUserRequest req) {
        u.setEmail(req.getEmail());
        u.setName(req.getName());
        u.setRole(req.getRole());
    }
}
package com.clinic.backend.web.mapper;

import com.clinic.backend.core.common.base.BaseMapper;
import com.clinic.backend.core.domain.model.User;
import com.clinic.backend.web.dto.CreateUserRequest;
import com.clinic.backend.web.dto.UserResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper implements BaseMapper<User, CreateUserRequest, UserResponse> {

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
    public UserResponse toResponse(User u) {
        return new UserResponse(
                u.getId(),
                u.getEmail(),
                u.getName(),
                u.getRole()
        );
    }

    @Override
    public List<UserResponse> toList(List<User> list) {
        return list.stream().map(this::toResponse).toList();
    }

    @Override
    public void update(User u, CreateUserRequest req) {
        u.setEmail(req.getEmail());
        u.setName(req.getName());
        u.setRole(req.getRole());
    }
}
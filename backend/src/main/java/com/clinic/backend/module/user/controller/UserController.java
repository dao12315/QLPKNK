package com.clinic.backend.module.user.controller;

import com.clinic.backend.common.base.BaseController;
import com.clinic.backend.module.user.dto.ChangePasswordRequest;
import com.clinic.backend.module.user.dto.CreateUserRequest;
import com.clinic.backend.module.user.dto.UserFilter;
import com.clinic.backend.module.user.dto.UserResponse;
import com.clinic.backend.module.user.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController
        extends BaseController<CreateUserRequest, UserResponse, UserFilter, UUID> {

    private final UserService userService;

    public UserController(UserService service) {
        super(service);
        this.userService = service;
    }

    @Override
    @GetMapping
    public Page<UserResponse> search(@ModelAttribute UserFilter filter) {
        return userService.search(filter);
    }
    @PostMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordRequest req) {
        userService.changePassword(req);
    }

}


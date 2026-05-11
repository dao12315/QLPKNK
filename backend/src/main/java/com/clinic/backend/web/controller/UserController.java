package com.clinic.backend.web.controller;

import com.clinic.backend.core.common.base.BaseController;
import com.clinic.backend.web.dto.ChangePasswordRequest;
import com.clinic.backend.web.dto.CreateUserRequest;
import com.clinic.backend.web.dto.UserFilter;
import com.clinic.backend.web.dto.UserResponse;
import com.clinic.backend.core.service.UserService;
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

    @PostMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordRequest req) {
        userService.changePassword(req);
    }

}


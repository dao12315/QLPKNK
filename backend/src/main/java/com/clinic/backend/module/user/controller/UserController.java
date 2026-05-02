package com.clinic.backend.module.user.controller;

import com.clinic.backend.common.base.BaseController;
import com.clinic.backend.module.user.dto.CreateUserRequest;
import com.clinic.backend.module.user.dto.TokenResponse;
import com.clinic.backend.module.user.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController
        extends BaseController<CreateUserRequest, TokenResponse> {

    public UserController(UserService service) {
        super(service);
    }
}
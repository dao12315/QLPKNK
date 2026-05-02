package com.clinic.backend.module.user.service;

import com.clinic.backend.common.base.BaseService;
import com.clinic.backend.module.user.dto.CreateUserRequest;
import com.clinic.backend.module.user.dto.TokenResponse;

public interface UserService extends BaseService<CreateUserRequest, TokenResponse> {
}
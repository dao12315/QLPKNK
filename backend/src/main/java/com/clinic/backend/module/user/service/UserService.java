package com.clinic.backend.module.user.service;

import com.clinic.backend.common.base.BaseService;
import com.clinic.backend.module.user.dto.ChangePasswordRequest;
import com.clinic.backend.module.user.dto.CreateUserRequest;
import com.clinic.backend.module.user.dto.UserFilter;
import com.clinic.backend.module.user.dto.UserResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface UserService extends BaseService<CreateUserRequest, UserResponse, UserFilter, UUID> {
    Page<UserResponse> search(UserFilter filter);
    void changePassword(ChangePasswordRequest request);
}
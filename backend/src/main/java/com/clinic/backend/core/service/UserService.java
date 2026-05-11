package com.clinic.backend.core.service;

import com.clinic.backend.core.common.base.BaseService;
import com.clinic.backend.web.dto.ChangePasswordRequest;
import com.clinic.backend.web.dto.CreateUserRequest;
import com.clinic.backend.web.dto.UserFilter;
import com.clinic.backend.web.dto.UserResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface UserService extends BaseService<CreateUserRequest, UserResponse, UserFilter, UUID> {
    Page<UserResponse> search(UserFilter filter);
    void changePassword(ChangePasswordRequest request);
}
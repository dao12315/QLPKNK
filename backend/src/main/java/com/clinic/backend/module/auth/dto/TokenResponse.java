package com.clinic.backend.module.auth.dto;

import com.clinic.backend.module.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenResponse {

    private String accessToken;
    private String refreshToken;
    private UserResponse user;
//    private String email;
//    private String name;
//    private String role;

}
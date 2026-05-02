package com.clinic.backend.module.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenResponse {

    private String accessToken;
    private String refreshToken;
    private String email;
    private String name;
    private String role;

}
package com.clinic.backend.module.auth.dto;

import lombok.Data;

@Data
public class RefreshRequest {
    private String refreshToken;
}

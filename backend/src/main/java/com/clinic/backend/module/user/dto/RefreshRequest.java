package com.clinic.backend.module.user.dto;

import lombok.Data;

@Data
public class RefreshRequest {
    private String refreshToken;
}

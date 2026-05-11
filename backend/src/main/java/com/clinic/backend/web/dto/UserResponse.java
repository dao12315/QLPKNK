package com.clinic.backend.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class UserResponse {

    private UUID id;

    private String name;

    private String email;

    private String role;
}
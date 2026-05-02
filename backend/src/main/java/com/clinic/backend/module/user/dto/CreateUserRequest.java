package com.clinic.backend.module.user.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CreateUserRequest {
    private String email;
    private String password;
    private String name;
    private String role;
}
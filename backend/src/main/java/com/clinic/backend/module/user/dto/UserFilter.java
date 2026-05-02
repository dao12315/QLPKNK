package com.clinic.backend.module.user.dto;

import com.clinic.backend.common.base.BaseFilter;
import lombok.Data;

@Data
public class UserFilter extends BaseFilter {
    private String email;
    private String name;
    private String role;
}
package com.clinic.backend.web.dto;

import com.clinic.backend.core.common.base.BaseFilter;
import lombok.Data;

@Data
public class UserFilter extends BaseFilter {
    private String email;
    private String name;
    private String role;
}
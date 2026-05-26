package com.clinic.backend.web.dto;

import com.clinic.backend.core.common.base.BaseFilter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorFilter extends BaseFilter {
    private String keyword;
    private String fullName;
    private String phone;

}
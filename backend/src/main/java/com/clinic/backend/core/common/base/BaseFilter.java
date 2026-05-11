package com.clinic.backend.core.common.base;

import lombok.Data;

@Data
public class BaseFilter {
    private Integer page = 0;
    private Integer size = 10;
    private String sort = "id,desc";
}
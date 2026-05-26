package com.clinic.backend.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ServiceDto {

    @Data
    public static class CreateRequest {
        @NotBlank private String name;
        private String description;
        @NotNull @DecimalMin("0") private BigDecimal price;
        private Integer durationMinutes;
        private Boolean isActive = true;
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String description;
        @DecimalMin("0") private BigDecimal price;
        private Integer durationMinutes;
        private Boolean isActive;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer durationMinutes;
        private Boolean isActive;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    public static class Filter {
        private Integer page = 0;
        private Integer size = 10;
        private String sort = "name,asc";
        private String name;
        private Boolean isActive;
    }
}

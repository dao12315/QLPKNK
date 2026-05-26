package com.clinic.backend.web.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class DoctorResponse {

    private UUID id;

    private UUID userId;

    private String fullName;

    private String specialization;

    private Integer experienceYears;

    private String phone;

    private Instant createdAt;

    private Instant updatedAt;
}
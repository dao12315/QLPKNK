package com.clinic.backend.web.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;

@Data
public class PatientResponse {

    private UUID userId;
    private UUID patientId;

    private String name;
    private String fullName;
    private String email;
    private String role;

    private String phone;
    private String gender;
    private LocalDate dob;
    private LocalDate dateOfBirth;
    private String address;
    private String medicalHistory;
    private String identityNumber;
    private String occupation;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelationship;
    private String status;
    private String note;
    private Instant createdAt;
    private Instant updatedAt;
}

package com.clinic.backend.web.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class PatientResponse {

    private UUID userId;
    private UUID patientId;

    private String name;
    private String email;
    private String role;

    private String phone;
    private String gender;
    private LocalDate dob;
    private String address;
    private String medicalHistory;
}
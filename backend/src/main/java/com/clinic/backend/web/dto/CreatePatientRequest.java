package com.clinic.backend.web.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreatePatientRequest {

    // USER
    private String name;
    private String email;
    private String password;

    // PATIENT
    private String phone;
    private String gender;
    private LocalDate dob;
    private String address;
    private String medicalHistory;
}
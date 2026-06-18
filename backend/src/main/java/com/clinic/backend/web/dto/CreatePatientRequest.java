package com.clinic.backend.web.dto;

import lombok.Data;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
public class CreatePatientRequest {

    // USER
    private String name;
    private String fullName;
    @Email
    private String email;
    private String password;

    // PATIENT
    @Size(max = 20)
    private String phone;
    private String gender;
    private LocalDate dob;
    private LocalDate dateOfBirth;
    private String address;
    private String medicalHistory;
    @Size(max = 30)
    private String identityNumber;
    @Size(max = 100)
    private String occupation;
    @Size(max = 100)
    private String emergencyContactName;
    @Size(max = 20)
    private String emergencyContactPhone;
    @Size(max = 50)
    private String emergencyContactRelationship;
    @Pattern(regexp = "active|inactive", message = "must be active or inactive")
    private String status;
    private String note;
}

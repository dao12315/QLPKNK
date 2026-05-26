package com.clinic.backend.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDoctorRequest {

    private String name;

    private String email;

    private String password;

    private String fullName;

    private String specialization;

    private Integer experienceYears;

    private String phone;
}
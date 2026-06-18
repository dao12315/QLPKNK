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

    private String licenseNumber;

    private String degree;

    private Integer experienceYears;

    private Integer yearsOfExperience;

    private String room;

    private String phone;
}

package com.clinic.backend.web.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

public class PatientMedicalInfoDto {
    @Data
    public static class Request {
        private String medicalHistory;
        private String allergies;
        private String currentMedications;
        private String chronicDiseases;
        private String pastSurgeries;
        private String bloodPressure;
        private Boolean heartDisease;
        private Boolean diabetes;
        private Boolean hepatitis;
        private Boolean asthma;
        private Boolean isPregnant;
        private Boolean isBreastfeeding;
        private String medicalNote;
    }

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID patientId;
        private String medicalHistory;
        private String allergies;
        private String currentMedications;
        private String chronicDiseases;
        private String pastSurgeries;
        private String bloodPressure;
        private Boolean heartDisease;
        private Boolean diabetes;
        private Boolean hepatitis;
        private Boolean asthma;
        private Boolean isPregnant;
        private Boolean isBreastfeeding;
        private String medicalNote;
        private Instant createdAt;
        private Instant updatedAt;
    }
}

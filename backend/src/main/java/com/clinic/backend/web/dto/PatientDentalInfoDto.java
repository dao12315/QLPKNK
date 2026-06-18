package com.clinic.backend.web.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

public class PatientDentalInfoDto {
    @Data
    public static class Request {
        private String chiefComplaint;
        private String dentalHistory;
        private String toothPainLocation;
        @Min(0)
        @Max(10)
        private Integer painLevel;
        private Boolean gumBleeding;
        private Boolean toothSensitivity;
        private Boolean badBreath;
        private Boolean cavities;
        private String brushingFrequency;
        private String flossingHabit;
        private String dentalNote;
    }

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID patientId;
        private String chiefComplaint;
        private String dentalHistory;
        private String toothPainLocation;
        private Integer painLevel;
        private Boolean gumBleeding;
        private Boolean toothSensitivity;
        private Boolean badBreath;
        private Boolean cavities;
        private String brushingFrequency;
        private String flossingHabit;
        private String dentalNote;
        private Instant createdAt;
        private Instant updatedAt;
    }
}

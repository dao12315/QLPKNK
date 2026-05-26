package com.clinic.backend.web.dto;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

public class ScheduleDto {

    @Data
    public static class CreateRequest {
        @NotNull private UUID doctorId;
        @NotNull @Min(0) @Max(6) private Short dayOfWeek;
        @NotNull private LocalTime startTime;
        @NotNull private LocalTime endTime;
        private Boolean isActive = true;
    }

    @Data
    public static class UpdateRequest {
        private LocalTime startTime;
        private LocalTime endTime;
        private Boolean isActive;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID doctorId;
        private String doctorName;
        private Short dayOfWeek;
        private String dayName;
        private LocalTime startTime;
        private LocalTime endTime;
        private Boolean isActive;
    }
}

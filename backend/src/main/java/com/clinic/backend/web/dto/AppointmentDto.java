package com.clinic.backend.web.dto;


import com.clinic.backend.core.common.base.BaseFilter;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

public class AppointmentDto {

    // ─── Request: Tạo lịch hẹn ────────────────────────────────
    @Data
    public static class CreateRequest {

        @NotNull(message = "Patient ID is required")
        private UUID patientId;

        @NotNull(message = "Doctor ID is required")
        private UUID doctorId;

        private UUID chairId; // optional

        @NotNull(message = "Start time is required")
        private Instant startTime;

        @NotNull(message = "End time is required")
        private Instant endTime;

        private String note;
    }

    // ─── Request: Hủy lịch hẹn ───────────────────────────────
    @Data
    public static class CancelRequest {
        @NotNull(message = "Cancellation reason is required")
        private String cancellationReason;
    }

    // ─── Request: Dời lịch hẹn ───────────────────────────────
    @Data
    public static class RescheduleRequest {
        @NotNull(message = "New start time is required")
        private Instant newStartTime;

        @NotNull(message = "New end time is required")
        private Instant newEndTime;

        private String note;
    }

    // ─── Response ─────────────────────────────────────────────
    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;

        // Patient info
        private UUID patientId;
        private String patientName;
        private String patientPhone;

        // Doctor info
        private UUID doctorId;
        private String doctorName;

        // Chair info
        private UUID chairId;
        private String chairName;

        private Instant startTime;
        private Instant endTime;
        private String status;
        private String note;
        private String cancellationReason;

        // Thông tin lịch gốc nếu đây là lịch được dời
        private UUID rescheduledFromId;

        private Instant createdAt;
        private Instant updatedAt;
    }

    // ─── Filter: Tìm kiếm lịch hẹn ───────────────────────────
    @Data
    public static class Filter extends BaseFilter {

        private UUID doctorId;
        private UUID patientId;
        private UUID chairId;
        private String status;
        private Instant dateFrom;
        private Instant dateTo;
    }
}

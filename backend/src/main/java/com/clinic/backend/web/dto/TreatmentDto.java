package com.clinic.backend.web.dto;


import com.clinic.backend.core.common.base.BaseFilter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class TreatmentDto {

    // ─── UC15 – Tạo hồ sơ điều trị ───────────────────────────
    @Data
    public static class CreateRequest {
        @NotNull private UUID patientId;
        @NotNull private UUID doctorId;
        private String diagnosis;
        private String note;
        private List<String> toothCodes; // List<String> khớp với entity
        private String toothNote;
    }

    @Data
    public static class UpdateRequest {
        private String status;
        private String diagnosis;
        private String note;
        private List<String> toothCodes;
        private String toothNote;
    }

    // ─── UC16 – Phiên điều trị ────────────────────────────────
    @Data
    public static class SessionRequest {
        @NotNull private UUID treatmentId;
        private UUID appointmentId; // nullable – liên kết với lịch hẹn nếu có
        private String note;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class SessionResponse {
        private UUID id;
        private UUID treatmentId;
        private UUID appointmentId;
        private String appointmentStatus;
        private String note;
        private Instant createdAt;
    }

    // ─── UC17 – Dịch vụ trong điều trị ───────────────────────
    @Data
    public static class ServiceItemRequest {
        @NotNull  private UUID treatmentId;
        private UUID serviceId;          // nullable – chọn từ danh mục hoặc nhập tay
        @NotBlank private String serviceName;
        @Min(1)   private Integer quantity = 1;
        @NotNull @DecimalMin("0") private BigDecimal unitPrice;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class ServiceItemResponse {
        private UUID id;
        private UUID treatmentId;
        private UUID serviceId;
        private String serviceName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal total; // quantity * unitPrice – tính ở mapper
    }

    // ─── Response đầy đủ hồ sơ điều trị ──────────────────────
    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID patientId;
        private String patientName;
        private UUID doctorId;
        private String doctorName;
        private String status;
        private String diagnosis;
        private String note;
        private List<String> toothCodes;
        private String toothNote;
        private List<SessionResponse> sessions;
        private List<ServiceItemResponse> serviceItems;
        private Instant createdAt;
        private Instant updatedAt;
    }

    // ─── Filter ───────────────────────────────────────────────
    @Data
    public static class Filter extends BaseFilter {
        private String sort = "createdAt,desc";
        private UUID patientId;
        private UUID doctorId;
        private String status;
    }
}

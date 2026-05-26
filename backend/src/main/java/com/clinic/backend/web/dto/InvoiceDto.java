package com.clinic.backend.web.dto;


import com.clinic.backend.core.common.base.BaseFilter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class InvoiceDto {

    // ─── UC22 – Lập hóa đơn ──────────────────────────────────
    @Data
    public static class CreateRequest {
        @NotNull private UUID treatmentId;
        @NotNull private UUID patientId;
        private String note;
        // Nếu không truyền → tự tính từ treatment_services
        private BigDecimal totalAmount;
    }

    @Data
    public static class UpdateRequest {
        private String note;
        private BigDecimal totalAmount;
    }

    // ─── UC23 – Ghi nhận thanh toán ──────────────────────────
    @Data
    public static class PaymentRequest {
        @NotNull @DecimalMin("0.01") private BigDecimal amount;
        @NotBlank private String method; // cash | banking | momo | vnpay | other
        private String note;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class PaymentResponse {
        private UUID id;
        private UUID invoiceId;
        private BigDecimal amount;
        private String method;
        private String note;
        private Instant paidAt;
    }

    // ─── Response ─────────────────────────────────────────────
    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        // Treatment info (OneToOne)
        private UUID treatmentId;
        // Patient info (ManyToOne)
        private UUID patientId;
        private String patientName;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
        private BigDecimal remainingAmount;
        private String status;
        private String note;
        private List<PaymentResponse> payments;
        private Instant createdAt;
        private Instant updatedAt;
    }

    // ─── Filter – UC24 ───────────────────────────────────────
    @Data
    public static class Filter extends BaseFilter {
        private String sort = "createdAt,desc";
        private UUID patientId;
        private String status;
        private Instant dateFrom;
        private Instant dateTo;
    }
}
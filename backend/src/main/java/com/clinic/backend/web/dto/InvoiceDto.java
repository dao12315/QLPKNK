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

    @Data
    public static class CreateRequest {
        @NotNull private UUID treatmentId;
        @NotNull private UUID patientId;
        private String note;
        private BigDecimal totalAmount;
        @DecimalMin("0") private BigDecimal discountAmount;
    }

    @Data
    public static class UpdateRequest {
        private String note;
        private BigDecimal totalAmount;
        @DecimalMin("0") private BigDecimal discountAmount;
        private String cancelReason;
    }

    @Data
    public static class PaymentRequest {
        @NotNull @DecimalMin("0.01") private BigDecimal amount;
        @NotBlank private String method;
        private String note;
        private String transactionCode;
        private String status;
    }

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class PaymentResponse {
        private UUID id;
        private UUID invoiceId;
        private String paymentCode;
        private BigDecimal amount;
        private String method;
        private String note;
        private String transactionCode;
        private UUID receivedBy;
        private String status;
        private Instant paidAt;
        private Instant createdAt;
    }

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID treatmentId;
        private UUID patientId;
        private String patientName;
        private String invoiceCode;
        private BigDecimal serviceAmount;
        private BigDecimal medicineAmount;
        private BigDecimal totalAmount;
        private BigDecimal discountAmount;
        private BigDecimal finalAmount;
        private BigDecimal paidAmount;
        private BigDecimal remainingAmount;
        private UUID issuedBy;
        private String status;
        private String note;
        private String cancelReason;
        private List<PaymentResponse> payments;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    public static class Filter extends BaseFilter {
        private String sort = "createdAt,desc";
        private UUID patientId;
        private UUID treatmentId;
        private String status;
        private Instant dateFrom;
        private Instant dateTo;
    }
}

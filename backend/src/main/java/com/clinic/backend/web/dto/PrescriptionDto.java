package com.clinic.backend.web.dto;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class PrescriptionDto {

    @Data
    public static class ItemRequest {
        @NotNull private UUID medicineId;
        @NotNull @Min(1) private Integer quantity;
        private String dosage;
    }

    @Data
    public static class CreateRequest {
        @NotNull private UUID treatmentId;
        private String note;
        @NotEmpty @Valid
        private List<ItemRequest> items;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class ItemResponse {
        private UUID id;
        private UUID medicineId;
        private String medicineName;
        private String medicineUnit;
        private BigDecimal medicinePrice;
        private Integer quantity;
        private String dosage;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID treatmentId;
        private String patientName;
        private String doctorName;
        private String note;
        private List<ItemResponse> items;
        private Instant createdAt;
    }
}

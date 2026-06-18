package com.clinic.backend.web.dto;


import com.clinic.backend.core.common.base.BaseFilter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class MedicineDto {

    @Data
    public static class CreateRequest {
        @NotBlank private String name;
        private String unit;
        @NotNull @DecimalMin("0") private BigDecimal price;
        @Min(0) private Integer stock = 0;
        private String batchNumber;
        private LocalDate expiryDate;
        @Min(0) private Integer minStock;
        private String activeIngredient;
        private String concentration;
        private String manufacturer;
        private String usageNote;
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String unit;
        @DecimalMin("0") private BigDecimal price;
        private String batchNumber;
        private LocalDate expiryDate;
        @Min(0) private Integer minStock;
        private String activeIngredient;
        private String concentration;
        private String manufacturer;
        private String usageNote;
    }

    /** UC21 – Điều chỉnh tồn kho: delta > 0 = nhập, delta < 0 = xuất */
    @Data
    public static class StockAdjustRequest {
        @NotNull private Integer delta;
        private String reason;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private String name;
        private String unit;
        private BigDecimal price;
        private Integer stock;
        private String batchNumber;
        private LocalDate expiryDate;
        private Integer minStock;
        private String activeIngredient;
        private String concentration;
        private String manufacturer;
        private String usageNote;
        private boolean lowStock;   // stock < 10
        private boolean expired;    // expiryDate trước hôm nay
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    public static class Filter extends BaseFilter {
        private String sort = "name,asc";
        private String name;
        private Boolean lowStock;       // UC21 – lọc tồn thấp
        private Boolean expiringSoon;   // UC21 – lọc sắp hết hạn (30 ngày)
    }
}

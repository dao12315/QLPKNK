package com.clinic.backend.web.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class ReportDto {

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class RevenueEntry {
        private String period;        // "2025-05" / "2025-05-17" / "2025"
        private BigDecimal revenue;
        private Long invoiceCount;
        private Long paidCount;
    }

    @Data
    @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class RevenueSummary {
        private Instant from;
        private Instant to;
        private BigDecimal totalRevenue;
        private BigDecimal totalUnpaid;
        private Long totalInvoices;
        private List<RevenueEntry> breakdown;
    }

    @Data
    public static class RevenueFilter {
        private Instant from;
        private Instant to;
        private String groupBy = "month"; // day | month | year
    }
}

package com.clinic.backend.core.service;


import com.clinic.backend.web.dto.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final JdbcTemplate jdbc;

    /**
     * UC25 – Báo cáo doanh thu
     * Nhóm payments.paid_at theo day / month / year
     * paid_at là TIMESTAMP (Instant) trong PostgreSQL
     */
    public ReportDto.RevenueSummary getRevenueReport(ReportDto.RevenueFilter filter) {

        // Mặc định: từ đầu năm hiện tại đến hiện tại
        Instant from = filter.getFrom() != null
                ? filter.getFrom()
                : Instant.now().atZone(ZoneOffset.UTC)
                .withDayOfYear(1).withHour(0).withMinute(0).withSecond(0)
                .toInstant();
        Instant to = filter.getTo() != null ? filter.getTo() : Instant.now();

        String truncUnit = switch (filter.getGroupBy()) {
            case "day"  -> "day";
            case "year" -> "year";
            default     -> "month";
        };

        String fmt = switch (truncUnit) {
            case "day"  -> "YYYY-MM-DD";
            case "year" -> "YYYY";
            default     -> "YYYY-MM";
        };

        // Breakdown: nhóm theo kỳ (paid_at là TIMESTAMPTZ trong PostgreSQL)
        String breakdownSql = """
                SELECT
                    TO_CHAR(DATE_TRUNC(?, p.paid_at AT TIME ZONE 'UTC'), ?) AS period,
                    COALESCE(SUM(p.amount), 0)                               AS revenue,
                    COUNT(DISTINCT p.invoice_id)                             AS invoice_count,
                    COUNT(p.id)                                              AS paid_count
                FROM payments p
                WHERE p.paid_at BETWEEN ? AND ?
                GROUP BY DATE_TRUNC(?, p.paid_at AT TIME ZONE 'UTC')
                ORDER BY DATE_TRUNC(?, p.paid_at AT TIME ZONE 'UTC')
                """;

        List<ReportDto.RevenueEntry> breakdown = jdbc.query(
                breakdownSql,
                (rs, rowNum) -> ReportDto.RevenueEntry.builder()
                        .period(rs.getString("period"))
                        .revenue(rs.getBigDecimal("revenue"))
                        .invoiceCount(rs.getLong("invoice_count"))
                        .paidCount(rs.getLong("paid_count"))
                        .build(),
                truncUnit, fmt, from, to, truncUnit, truncUnit
        );

        // Tổng doanh thu thực thu trong kỳ
        BigDecimal totalRevenue = jdbc.queryForObject(
                "SELECT COALESCE(SUM(amount), 0) FROM payments WHERE paid_at BETWEEN ? AND ?",
                BigDecimal.class, from, to
        );

        // Tổng số tiền chưa thu (unpaid + partial)
        BigDecimal totalUnpaid = jdbc.queryForObject(
                """
                SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                FROM invoices
                WHERE status IN ('unpaid', 'partial')
                  AND created_at BETWEEN ? AND ?
                """,
                BigDecimal.class, from, to
        );

        // Tổng số hóa đơn phát sinh
        Long totalInvoices = jdbc.queryForObject(
                "SELECT COUNT(*) FROM invoices WHERE created_at BETWEEN ? AND ?",
                Long.class, from, to
        );

        return ReportDto.RevenueSummary.builder()
                .from(from)
                .to(to)
                .totalRevenue(totalRevenue)
                .totalUnpaid(totalUnpaid)
                .totalInvoices(totalInvoices)
                .breakdown(breakdown)
                .build();
    }
}

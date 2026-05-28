package com.clinic.backend.core.service;

import com.clinic.backend.web.dto.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final JdbcTemplate jdbc;

    /**
     * UC25 – Báo cáo doanh thu
     * Nhóm payments.paid_at theo day / month / year
     */
    public ReportDto.RevenueSummary getRevenueReport(ReportDto.RevenueFilter filter) {

        Instant now = Instant.now();

        Instant from = filter.getFrom() != null
                ? filter.getFrom()
                : now.atZone(ZoneOffset.UTC)
                .withDayOfYear(1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0)
                .toInstant();

        Instant to = filter.getTo() != null ? filter.getTo() : now;

        String groupBy = filter.getGroupBy() == null
                ? "month"
                : filter.getGroupBy().toLowerCase();

        String truncUnit = switch (groupBy) {
            case "day" -> "day";
            case "year" -> "year";
            case "month" -> "month";
            default -> "month";
        };

        String fmt = switch (truncUnit) {
            case "day" -> "YYYY-MM-DD";
            case "year" -> "YYYY";
            default -> "YYYY-MM";
        };

        Timestamp fromTs = Timestamp.from(from);
        Timestamp toTs = Timestamp.from(to);

        String breakdownSql = """
                SELECT
                    TO_CHAR(x.period_date, '%s') AS period,
                    COALESCE(SUM(x.amount), 0) AS revenue,
                    COUNT(DISTINCT x.invoice_id) AS invoice_count,
                    COUNT(x.id) AS paid_count
                FROM (
                    SELECT
                        p.id,
                        p.invoice_id,
                        p.amount,
                        DATE_TRUNC('%s', p.paid_at) AS period_date
                    FROM payments p
                    WHERE p.paid_at BETWEEN ? AND ?
                ) x
                GROUP BY x.period_date
                ORDER BY x.period_date
                """.formatted(fmt, truncUnit);

        List<ReportDto.RevenueEntry> breakdown = jdbc.query(
                breakdownSql,
                (rs, rowNum) -> ReportDto.RevenueEntry.builder()
                        .period(rs.getString("period"))
                        .revenue(rs.getBigDecimal("revenue"))
                        .invoiceCount(rs.getLong("invoice_count"))
                        .paidCount(rs.getLong("paid_count"))
                        .build(),
                fromTs,
                toTs
        );

        BigDecimal totalRevenue = jdbc.queryForObject(
                """
                SELECT COALESCE(SUM(amount), 0)
                FROM payments
                WHERE paid_at BETWEEN ? AND ?
                """,
                BigDecimal.class,
                fromTs,
                toTs
        );

        BigDecimal totalUnpaid = jdbc.queryForObject(
                """
                SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                FROM invoices
                WHERE LOWER(status) IN ('unpaid', 'partial')
                  AND created_at BETWEEN ? AND ?
                """,
                BigDecimal.class,
                fromTs,
                toTs
        );

        Long totalInvoices = jdbc.queryForObject(
                """
                SELECT COUNT(*)
                FROM invoices
                WHERE created_at BETWEEN ? AND ?
                """,
                Long.class,
                fromTs,
                toTs
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
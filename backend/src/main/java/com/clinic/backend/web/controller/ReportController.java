package com.clinic.backend.web.controller;

import com.clinic.backend.core.service.ReportService;
import com.clinic.backend.web.dto.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService service;

    /**
     * UC25 – Báo cáo doanh thu
     * GET /api/reports/revenue?from=2025-01-01T00:00:00Z&to=2025-12-31T23:59:59Z&groupBy=month
     */
    @GetMapping("/revenue")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ReportDto.RevenueSummary> getRevenueReport(
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(defaultValue = "month") String groupBy) {

        ReportDto.RevenueFilter filter = new ReportDto.RevenueFilter();
        filter.setFrom(from);
        filter.setTo(to);
        filter.setGroupBy(groupBy);

        return ResponseEntity.ok(service.getRevenueReport(filter));
    }
}
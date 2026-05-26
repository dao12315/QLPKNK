package com.clinic.backend.web.controller;

import com.clinic.backend.core.service.InvoiceService;
import com.clinic.backend.web.dto.InvoiceDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService service;

    /** UC22 – Lập hóa đơn từ phiếu điều trị */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('receptionist', 'admin')")
    public ResponseEntity<InvoiceDto.Response> create(
            @Valid @RequestBody InvoiceDto.CreateRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    /** UC22 – Cập nhật hóa đơn */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('receptionist', 'admin')")
    public ResponseEntity<InvoiceDto.Response> update(
            @PathVariable UUID id,
            @Valid @RequestBody InvoiceDto.UpdateRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    /** UC22 – Hủy hóa đơn */
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('receptionist', 'admin')")
    public ResponseEntity<InvoiceDto.Response> cancel(
            @PathVariable UUID id) {

        return ResponseEntity.ok(service.cancel(id));
    }

    /** UC23 – Ghi nhận thanh toán */
    @PostMapping("/{id}/payments")
    @PreAuthorize("hasAnyAuthority('receptionist', 'admin')")
    public ResponseEntity<InvoiceDto.Response> recordPayment(
            @PathVariable UUID id,
            @Valid @RequestBody InvoiceDto.PaymentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.recordPayment(id, request));
    }

    /** UC23 – Lịch sử thanh toán */
    @GetMapping("/{id}/payments")
    @PreAuthorize("hasAnyAuthority('receptionist', 'admin', 'patient')")
    public ResponseEntity<List<InvoiceDto.PaymentResponse>> getPayments(
            @PathVariable UUID id) {

        return ResponseEntity.ok(service.getPayments(id));
    }

    /** UC24 – Xem chi tiết hóa đơn */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'receptionist', 'patient')")
    public ResponseEntity<InvoiceDto.Response> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(service.getById(id));
    }

    /** UC24 – Tìm kiếm / lịch sử hóa đơn */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'receptionist', 'patient')")
    public ResponseEntity<Page<InvoiceDto.Response>> search(
            @ModelAttribute InvoiceDto.Filter filter) {

        return ResponseEntity.ok(service.search(filter));
    }
}
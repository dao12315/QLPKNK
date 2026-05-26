package com.clinic.backend.web.controller;

import com.clinic.backend.core.service.AppointmentService;
import com.clinic.backend.web.dto.AppointmentDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    /** UC09 – Đặt lịch hẹn */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('receptionist', 'patient', 'admin')")
    public ResponseEntity<AppointmentDto.Response> create(
            @Valid @RequestBody AppointmentDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    /** UC10 – Xác nhận lịch hẹn */
    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasAnyAuthority('receptionist', 'admin')")
    public ResponseEntity<AppointmentDto.Response> confirm(
            @PathVariable UUID id) {
        return ResponseEntity.ok(service.confirm(id));
    }

    /** UC11 – Hủy lịch hẹn */
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('receptionist', 'patient', 'admin')")
    public ResponseEntity<AppointmentDto.Response> cancel(
            @PathVariable UUID id,
            @Valid @RequestBody AppointmentDto.CancelRequest request) {
        return ResponseEntity.ok(service.cancel(id, request));
    }

    /** UC11 – Dời lịch hẹn */
    @PatchMapping("/{id}/reschedule")
    @PreAuthorize("hasAnyAuthority('receptionist', 'patient', 'admin')")
    public ResponseEntity<AppointmentDto.Response> reschedule(
            @PathVariable UUID id,
            @Valid @RequestBody AppointmentDto.RescheduleRequest request) {
        return ResponseEntity.ok(service.reschedule(id, request));
    }

    /**
     * UC12 – Xem lịch hẹn trong ngày
     * doctorId = null → tất cả bác sĩ
     * doctorId = X → riêng bác sĩ đó
     */
    @GetMapping("/day")
    @PreAuthorize("hasAnyAuthority('dentist', 'receptionist', 'admin')")
    public ResponseEntity<List<AppointmentDto.Response>> getForDay(
            @RequestParam(required = false) UUID doctorId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return ResponseEntity.ok(
                service.getForDay(
                        doctorId,
                        date != null ? date : LocalDate.now()
                )
        );
    }

    /** Tìm kiếm lịch hẹn */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('receptionist', 'admin', 'dentist')")
    public ResponseEntity<Page<AppointmentDto.Response>> search(
            @ModelAttribute AppointmentDto.Filter filter) {
        return ResponseEntity.ok(service.search(filter));
    }

    /** Chi tiết lịch hẹn */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('receptionist', 'admin', 'dentist', 'patient')")
    public ResponseEntity<AppointmentDto.Response> getById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }
}
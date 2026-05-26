package com.clinic.backend.web.controller;

import com.clinic.backend.core.service.impl.TreatmentServiceImpl;
import com.clinic.backend.web.dto.TreatmentDto;
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
@RequestMapping("/api/treatments")
@RequiredArgsConstructor
public class TreatmentController {

    private final TreatmentServiceImpl service;

    /** UC15 – Tạo hồ sơ điều trị */
    @PostMapping
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<TreatmentDto.Response> create(
            @Valid @RequestBody TreatmentDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<TreatmentDto.Response> update(
            @PathVariable UUID id,
            @Valid @RequestBody TreatmentDto.UpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('dentist', 'receptionist', 'admin')")
    public ResponseEntity<TreatmentDto.Response> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('dentist', 'receptionist', 'admin')")
    public ResponseEntity<Page<TreatmentDto.Response>> search(
            @ModelAttribute TreatmentDto.Filter filter) {
        return ResponseEntity.ok(service.search(filter));
    }

    /** UC16 – Ghi nhận phiên điều trị */
    @PostMapping("/sessions")
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<TreatmentDto.SessionResponse> addSession(
            @Valid @RequestBody TreatmentDto.SessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addSession(request));
    }

    @GetMapping("/{treatmentId}/sessions")
    @PreAuthorize("hasAnyAuthority('dentist', 'receptionist', 'admin')")
    public ResponseEntity<List<TreatmentDto.SessionResponse>> getSessions(
            @PathVariable UUID treatmentId) {
        return ResponseEntity.ok(service.getSessions(treatmentId));
    }

    @DeleteMapping("/sessions/{sessionId}")
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<Void> deleteSession(@PathVariable UUID sessionId) {
        service.deleteSession(sessionId);
        return ResponseEntity.noContent().build();
    }

    /** UC17 – Chỉ định dịch vụ điều trị */
    @PostMapping("/service-items")
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<TreatmentDto.ServiceItemResponse> addServiceItem(
            @Valid @RequestBody TreatmentDto.ServiceItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addServiceItem(request));
    }

    @PutMapping("/service-items/{id}")
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<TreatmentDto.ServiceItemResponse> updateServiceItem(
            @PathVariable UUID id,
            @Valid @RequestBody TreatmentDto.ServiceItemRequest request) {
        return ResponseEntity.ok(service.updateServiceItem(id, request));
    }

    @DeleteMapping("/service-items/{id}")
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<Void> deleteServiceItem(@PathVariable UUID id) {
        service.deleteServiceItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{treatmentId}/service-items")
    @PreAuthorize("hasAnyAuthority('dentist', 'receptionist', 'admin')")
    public ResponseEntity<List<TreatmentDto.ServiceItemResponse>> getServiceItems(
            @PathVariable UUID treatmentId) {
        return ResponseEntity.ok(service.getServiceItems(treatmentId));
    }
}
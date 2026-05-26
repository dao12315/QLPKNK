package com.clinic.backend.web.controller;

import com.clinic.backend.core.service.PrescriptionService;
import com.clinic.backend.web.dto.PrescriptionDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService service;

    /** UC18 – Kê đơn thuốc */
    @PostMapping
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<PrescriptionDto.Response> create(
            @Valid @RequestBody PrescriptionDto.CreateRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('dentist', 'receptionist', 'admin')")
    public ResponseEntity<PrescriptionDto.Response> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/treatment/{treatmentId}")
    @PreAuthorize("hasAnyAuthority('dentist', 'receptionist', 'admin', 'patient')")
    public ResponseEntity<List<PrescriptionDto.Response>> getByTreatment(
            @PathVariable UUID treatmentId) {

        return ResponseEntity.ok(service.getByTreatment(treatmentId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('dentist')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}
package com.clinic.backend.web.controller;

import com.clinic.backend.core.service.ScheduleService;
import com.clinic.backend.web.dto.ScheduleDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctor-schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService service;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'receptionist', 'dentist', 'patient')")
    public ResponseEntity<List<ScheduleDto.Response>> getAll(
            @RequestParam(required = false) UUID doctorId,
            @RequestParam(required = false) Boolean isActive) {
        if (doctorId != null) {
            return ResponseEntity.ok(service.getByDoctor(doctorId, isActive != null && isActive));
        }

        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ScheduleDto.Response> create(
            @Valid @RequestBody ScheduleDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ScheduleDto.Response> update(
            @PathVariable UUID id,
            @Valid @RequestBody ScheduleDto.UpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('admin', 'receptionist', 'dentist', 'patient')")
    public ResponseEntity<List<ScheduleDto.Response>> getByDoctor(
            @PathVariable UUID doctorId,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        return ResponseEntity.ok(service.getByDoctor(doctorId, activeOnly));
    }
}
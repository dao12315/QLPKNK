package com.clinic.backend.web.controller;


import com.clinic.backend.core.service.DentalServiceService;
import com.clinic.backend.web.dto.ServiceDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final DentalServiceService service;

    /** UC19 – Tạo dịch vụ */
    @PostMapping
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ServiceDto.Response> create(
            @Valid @RequestBody ServiceDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    /** UC19 – Cập nhật dịch vụ */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ServiceDto.Response> update(
            @PathVariable UUID id,
            @Valid @RequestBody ServiceDto.UpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    /** UC19 – Ẩn dịch vụ (soft delete) */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ServiceDto.Response> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ServiceDto.Response>> search(
            @ModelAttribute ServiceDto.Filter filter) {
        return ResponseEntity.ok(service.search(filter));
    }
}

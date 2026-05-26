package com.clinic.backend.web.controller;

import com.clinic.backend.core.service.MedicineService;
import com.clinic.backend.web.dto.MedicineDto;
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
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService service;

    /** UC20 – Tạo thuốc */
    @PostMapping
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<MedicineDto.Response> create(
            @Valid @RequestBody MedicineDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    /** UC20 – Cập nhật thuốc */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<MedicineDto.Response> update(
            @PathVariable UUID id,
            @Valid @RequestBody MedicineDto.UpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    /** UC20 – Xóa thuốc */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'dentist', 'receptionist')")
    public ResponseEntity<MedicineDto.Response> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'dentist', 'receptionist')")
    public ResponseEntity<Page<MedicineDto.Response>> search(
            @ModelAttribute MedicineDto.Filter filter) {
        return ResponseEntity.ok(service.search(filter));
    }

    /** UC21 – Điều chỉnh tồn kho */
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<MedicineDto.Response> adjustStock(
            @PathVariable UUID id,
            @Valid @RequestBody MedicineDto.StockAdjustRequest request) {
        return ResponseEntity.ok(service.adjustStock(id, request));
    }

    /** UC21 – Danh sách tồn kho thấp */
    @GetMapping("/inventory/low-stock")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<List<MedicineDto.Response>> getLowStock() {
        return ResponseEntity.ok(service.getLowStock());
    }

    /** UC21 – Danh sách thuốc sắp hết hạn */
    @GetMapping("/inventory/expiring-soon")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<List<MedicineDto.Response>> getExpiringSoon() {
        return ResponseEntity.ok(service.getExpiringSoon());
    }
}
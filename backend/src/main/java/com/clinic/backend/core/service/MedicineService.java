package com.clinic.backend.core.service;


import com.clinic.backend.core.domain.model.Medicine;
import com.clinic.backend.core.domain.repository.MedicineRepository;
import com.clinic.backend.web.dto.MedicineDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicineService {

    private static final int LOW_STOCK_THRESHOLD = 10;
    private static final int EXPIRY_DAYS_AHEAD   = 30;

    private final MedicineRepository repo;

    /** UC20 – Tạo thuốc */
    public MedicineDto.Response create(MedicineDto.CreateRequest req) {
        Medicine m = new Medicine();
        m.setName(req.getName());
        m.setUnit(req.getUnit());
        m.setPrice(req.getPrice());
        m.setStock(req.getStock() != null ? req.getStock() : 0);
        m.setBatchNumber(req.getBatchNumber());
        m.setExpiryDate(req.getExpiryDate());
        m.setMinStock(req.getMinStock() != null ? req.getMinStock() : 0);
        m.setActiveIngredient(req.getActiveIngredient());
        m.setConcentration(req.getConcentration());
        m.setManufacturer(req.getManufacturer());
        m.setUsageNote(req.getUsageNote());
        m.setCreatedAt(Instant.now());
        m.setUpdatedAt(Instant.now());
        return toResponse(repo.saveAndFlush(m));
    }

    /** UC20 – Cập nhật thông tin thuốc (không bao gồm tồn kho) */
    public MedicineDto.Response update(UUID id, MedicineDto.UpdateRequest req) {
        Medicine m = findOrThrow(id);
        if (req.getName()        != null) m.setName(req.getName());
        if (req.getUnit()        != null) m.setUnit(req.getUnit());
        if (req.getPrice()       != null) m.setPrice(req.getPrice());
        if (req.getBatchNumber() != null) m.setBatchNumber(req.getBatchNumber());
        if (req.getExpiryDate()  != null) m.setExpiryDate(req.getExpiryDate());
        if (req.getMinStock() != null) m.setMinStock(req.getMinStock());
        if (req.getActiveIngredient() != null) m.setActiveIngredient(req.getActiveIngredient());
        if (req.getConcentration() != null) m.setConcentration(req.getConcentration());
        if (req.getManufacturer() != null) m.setManufacturer(req.getManufacturer());
        if (req.getUsageNote() != null) m.setUsageNote(req.getUsageNote());
        m.setUpdatedAt(Instant.now());
        return toResponse(repo.saveAndFlush(m));
    }

    /** UC20 – Xóa thuốc */
    public void delete(UUID id) {
        if (!repo.existsById(id))
            throw new EntityNotFoundException("Medicine not found: " + id);
        repo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public MedicineDto.Response getById(UUID id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<MedicineDto.Response> search(MedicineDto.Filter filter) {
        String[] parts = filter.getSort().split(",");
        Sort sort = Sort.by(
                parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                        ? Sort.Direction.DESC : Sort.Direction.ASC,
                parts[0]
        );
        PageRequest pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Specification<Medicine> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.getName() != null && !filter.getName().isBlank())
                predicates.add(cb.like(cb.lower(root.get("name")),
                        "%" + filter.getName().toLowerCase() + "%"));
            if (Boolean.TRUE.equals(filter.getLowStock()))
                predicates.add(cb.lt(root.get("stock"), LOW_STOCK_THRESHOLD));
            if (Boolean.TRUE.equals(filter.getExpiringSoon())) {
                LocalDate deadline = LocalDate.now().plusDays(EXPIRY_DAYS_AHEAD);
                predicates.add(cb.between(root.get("expiryDate"), LocalDate.now(), deadline));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return repo.findAll(spec, pageable).map(this::toResponse);
    }

    /** UC21 – Điều chỉnh tồn kho */
    public MedicineDto.Response adjustStock(UUID id, MedicineDto.StockAdjustRequest req) {
        Medicine m = findOrThrow(id);
        int newStock = m.getStock() + req.getDelta();
        if (newStock < 0)
            throw new IllegalStateException(
                    "Stock cannot be negative. Current: " + m.getStock() + ", delta: " + req.getDelta());
        m.setStock(newStock);
        m.setUpdatedAt(Instant.now());
        return toResponse(repo.saveAndFlush(m));
    }

    /** UC21 – Danh sách tồn kho thấp */
    @Transactional(readOnly = true)
    public List<MedicineDto.Response> getLowStock() {
        return repo.findLowStock(LOW_STOCK_THRESHOLD)
                .stream().map(this::toResponse).toList();
    }

    /** UC21 – Danh sách sắp hết hạn (30 ngày tới) */
    @Transactional(readOnly = true)
    public List<MedicineDto.Response> getExpiringSoon() {
        LocalDate today    = LocalDate.now();
        LocalDate deadline = today.plusDays(EXPIRY_DAYS_AHEAD);
        return repo.findExpiringSoon(today, deadline)
                .stream().map(this::toResponse).toList();
    }

    // ─── Helpers ─────────────────────────────────────────────
    private Medicine findOrThrow(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medicine not found: " + id));
    }

    private MedicineDto.Response toResponse(Medicine m) {
        LocalDate today = LocalDate.now();
        return MedicineDto.Response.builder()
                .id(m.getId())
                .name(m.getName())
                .unit(m.getUnit())
                .price(m.getPrice())
                .stock(m.getStock())
                .batchNumber(m.getBatchNumber())
                .expiryDate(m.getExpiryDate())
                .minStock(m.getMinStock())
                .activeIngredient(m.getActiveIngredient())
                .concentration(m.getConcentration())
                .manufacturer(m.getManufacturer())
                .usageNote(m.getUsageNote())
                .lowStock(m.getStock() < (m.getMinStock() != null ? m.getMinStock() : LOW_STOCK_THRESHOLD))
                .expired(m.getExpiryDate() != null && m.getExpiryDate().isBefore(today))
                .createdAt(m.getCreatedAt())
                .updatedAt(m.getUpdatedAt())
                .build();
    }
}

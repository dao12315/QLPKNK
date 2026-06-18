package com.clinic.backend.core.service;

import com.clinic.backend.core.domain.model.DentalService;
import com.clinic.backend.core.domain.repository.ServiceRepository;
import com.clinic.backend.web.dto.ServiceDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import org.springframework.transaction.annotation.Transactional;import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DentalServiceService {

    private final ServiceRepository repo;

    public DentalServiceService(ServiceRepository repo) {
        this.repo = repo;
    }
    /** UC19 – Tạo dịch vụ */
    public ServiceDto.Response create(ServiceDto.CreateRequest req) {
        DentalService entity = new DentalService();
        entity.setName(req.getName());
        entity.setCode(req.getCode() != null ? req.getCode() : generateServiceCode());
        entity.setCategory(req.getCategory());
        entity.setDescription(req.getDescription());
        entity.setPrice(req.getPrice());
        entity.setDurationMinutes(req.getDurationMinutes());
        entity.setEstimatedDuration(req.getEstimatedDuration());
        entity.setDefaultUnit(req.getDefaultUnit());
        entity.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
        return toResponse(repo.saveAndFlush(entity));
    }

    /** UC19 – Cập nhật dịch vụ */
    public ServiceDto.Response update(UUID id, ServiceDto.UpdateRequest req) {
        DentalService entity = findOrThrow(id);
        if (req.getName()            != null) entity.setName(req.getName());
        if (req.getCode()            != null) entity.setCode(req.getCode());
        if (req.getCategory()        != null) entity.setCategory(req.getCategory());
        if (req.getDescription()     != null) entity.setDescription(req.getDescription());
        if (req.getPrice()           != null) entity.setPrice(req.getPrice());
        if (req.getDurationMinutes() != null) entity.setDurationMinutes(req.getDurationMinutes());
        if (req.getEstimatedDuration() != null) entity.setEstimatedDuration(req.getEstimatedDuration());
        if (req.getDefaultUnit()     != null) entity.setDefaultUnit(req.getDefaultUnit());
        if (req.getIsActive()        != null) entity.setIsActive(req.getIsActive());
        entity.setUpdatedAt(Instant.now());
        return toResponse(repo.saveAndFlush(entity));
    }

    /** UC19 – Ẩn dịch vụ (soft delete: is_active = false) */
    public void delete(UUID id) {
        DentalService entity = findOrThrow(id);
        entity.setIsActive(false);
        entity.setUpdatedAt(Instant.now());
        repo.saveAndFlush(entity);
    }

    @Transactional(readOnly = true)
    public ServiceDto.Response getById(UUID id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<ServiceDto.Response> search(ServiceDto.Filter filter) {
        String[] parts = filter.getSort().split(",");
        Sort sort = Sort.by(
                parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                        ? Sort.Direction.DESC : Sort.Direction.ASC,
                parts[0]
        );
        PageRequest pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Specification<DentalService> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.getName() != null && !filter.getName().isBlank())
                predicates.add(cb.like(cb.lower(root.get("name")),
                        "%" + filter.getName().toLowerCase() + "%"));
            if (filter.getIsActive() != null)
                predicates.add(cb.equal(root.get("isActive"), filter.getIsActive()));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return repo.findAll(spec, pageable).map(this::toResponse);
    }

    // ─── Helpers ─────────────────────────────────────────────
    private DentalService findOrThrow(UUID id) {
        return repo.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Service not found: " + id));
    }

    private ServiceDto.Response toResponse(DentalService s) {
        return ServiceDto.Response.builder()
                .id(s.getId())
                .name(s.getName())
                .code(s.getCode())
                .category(s.getCategory())
                .description(s.getDescription())
                .price(s.getPrice())
                .durationMinutes(s.getDurationMinutes())
                .estimatedDuration(s.getEstimatedDuration())
                .defaultUnit(s.getDefaultUnit())
                .isActive(s.getIsActive())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    private String generateServiceCode() {
        return "DV" + java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
    }
}

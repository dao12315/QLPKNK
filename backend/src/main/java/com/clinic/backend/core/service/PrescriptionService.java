package com.clinic.backend.core.service;


import com.clinic.backend.core.domain.model.*;
import com.clinic.backend.core.domain.repository.MedicineRepository;
import com.clinic.backend.core.domain.repository.PrescriptionItemRepository;
import com.clinic.backend.core.domain.repository.PrescriptionRepository;
import com.clinic.backend.core.domain.repository.TreatmentRepository;
import com.clinic.backend.web.dto.PrescriptionDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepo;
    private final PrescriptionItemRepository itemRepo;
    private final com.clinic.backend.core.domain.repository.TreatmentRepository treatmentRepo;
    private final MedicineRepository medicineRepo;

    /** UC18 – Kê đơn thuốc */
    public PrescriptionDto.Response create(PrescriptionDto.CreateRequest req) {
        Treatment treatment = treatmentRepo.findById(req.getTreatmentId())
                .orElseThrow(() -> new EntityNotFoundException("Treatment not found: " + req.getTreatmentId()));

        Prescription prescription = new Prescription();
        prescription.setTreatment(treatment);   // object reference
        prescription.setNote(req.getNote());
        prescription.setCreatedAt(Instant.now());
        Prescription saved = prescriptionRepo.saveAndFlush(prescription);

        // Tạo từng PrescriptionItem – medicine là object reference
        List<PrescriptionItem> items = req.getItems().stream().map(ir -> {
            Medicine medicine = medicineRepo.findById(ir.getMedicineId())
                    .orElseThrow(() -> new EntityNotFoundException("Medicine not found: " + ir.getMedicineId()));
            PrescriptionItem item = new PrescriptionItem();
            item.setPrescription(saved);    // object reference
            item.setMedicine(medicine);     // object reference
            item.setQuantity(ir.getQuantity());
            item.setDosage(ir.getDosage());
            return item;
        }).collect(Collectors.toList());

        itemRepo.saveAll(items);
        itemRepo.flush();

        return toResponse(saved, items);
    }

    @Transactional(readOnly = true)
    public PrescriptionDto.Response getById(UUID id) {
        Prescription p = findOrThrow(id);
        return toResponse(p, itemRepo.findByPrescription_Id(id));
    }

    @Transactional(readOnly = true)
    public List<PrescriptionDto.Response> getByTreatment(UUID treatmentId) {
        return prescriptionRepo.findByTreatment_IdOrderByCreatedAtDesc(treatmentId)
                .stream()
                .map(p -> toResponse(p, itemRepo.findByPrescription_Id(p.getId())))
                .toList();
    }

    public void delete(UUID id) {
        if (!prescriptionRepo.existsById(id))
            throw new EntityNotFoundException("Prescription not found: " + id);
        // Items sẽ bị xóa cascade (OnDeleteAction.CASCADE trong entity)
        prescriptionRepo.deleteById(id);
    }

    // ─── Helpers ─────────────────────────────────────────────
    private Prescription findOrThrow(UUID id) {
        return prescriptionRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prescription not found: " + id));
    }

    private PrescriptionDto.Response toResponse(Prescription p, List<PrescriptionItem> items) {
        List<PrescriptionDto.ItemResponse> itemResponses = items.stream().map(item -> {
            Medicine m = item.getMedicine(); // object reference
            return PrescriptionDto.ItemResponse.builder()
                    .id(item.getId())
                    .medicineId(m != null ? m.getId() : null)
                    .medicineName(m != null ? m.getName() : null)
                    .medicineUnit(m != null ? m.getUnit() : null)
                    .quantity(item.getQuantity())
                    .dosage(item.getDosage())
                    .build();
        }).toList();

        return PrescriptionDto.Response.builder()
                .id(p.getId())
                .treatmentId(p.getTreatment().getId())
                .note(p.getNote())
                .items(itemResponses)
                .createdAt(p.getCreatedAt())
                .build();
    }
}

package com.clinic.backend.core.service;

import com.clinic.backend.core.domain.model.Medicine;
import com.clinic.backend.core.domain.model.Prescription;
import com.clinic.backend.core.domain.model.PrescriptionItem;
import com.clinic.backend.core.domain.model.Treatment;
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
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepo;
    private final PrescriptionItemRepository itemRepo;
    private final TreatmentRepository treatmentRepo;
    private final MedicineRepository medicineRepo;

    public PrescriptionDto.Response create(PrescriptionDto.CreateRequest req) {
        Treatment treatment = treatmentRepo.findById(req.getTreatmentId())
                .orElseThrow(() -> new EntityNotFoundException("Treatment not found: " + req.getTreatmentId()));

        Map<UUID, Integer> requestedQuantities = req.getItems().stream()
                .collect(Collectors.groupingBy(
                        PrescriptionDto.ItemRequest::getMedicineId,
                        Collectors.summingInt(PrescriptionDto.ItemRequest::getQuantity)
                ));

        Map<UUID, Medicine> medicinesById = requestedQuantities.keySet().stream()
                .sorted()
                .collect(Collectors.toMap(
                        medicineId -> medicineId,
                        medicineId -> medicineRepo.findByIdForUpdate(medicineId)
                                .orElseThrow(() -> new EntityNotFoundException("Medicine not found: " + medicineId))
                ));

        requestedQuantities.forEach((medicineId, quantity) -> {
            Medicine medicine = medicinesById.get(medicineId);
            int currentStock = medicine.getStock() != null ? medicine.getStock() : 0;
            if (quantity > currentStock) {
                throw new IllegalStateException(
                        "Not enough stock for medicine " + medicine.getName()
                                + ". Current stock: " + currentStock
                                + ", requested: " + quantity
                );
            }
        });

        Prescription prescription = new Prescription();
        prescription.setTreatment(treatment);
        prescription.setNote(req.getNote());
        prescription.setCreatedAt(Instant.now());
        Prescription saved = prescriptionRepo.saveAndFlush(prescription);

        List<PrescriptionItem> items = req.getItems().stream().map(ir -> {
            Medicine medicine = medicinesById.get(ir.getMedicineId());
            PrescriptionItem item = new PrescriptionItem();
            item.setPrescription(saved);
            item.setMedicine(medicine);
            item.setQuantity(ir.getQuantity());
            item.setDosage(ir.getDosage());
            return item;
        }).collect(Collectors.toList());

        requestedQuantities.forEach((medicineId, quantity) -> {
            Medicine medicine = medicinesById.get(medicineId);
            int newStock = medicine.getStock() - quantity;
            if (newStock < 0) {
                throw new IllegalStateException("Stock cannot be negative for medicine " + medicine.getName());
            }
            medicine.setStock(newStock);
            medicine.setUpdatedAt(Instant.now());
        });

        medicineRepo.saveAll(medicinesById.values());
        itemRepo.saveAll(items);
        medicineRepo.flush();
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

    @Transactional(readOnly = true)
    public List<PrescriptionDto.Response> getMine(UUID userId) {
        return prescriptionRepo.findByTreatment_Patient_User_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(p -> toResponse(p, itemRepo.findByPrescription_Id(p.getId())))
                .toList();
    }

    public void delete(UUID id) {
        if (!prescriptionRepo.existsById(id)) {
            throw new EntityNotFoundException("Prescription not found: " + id);
        }
        prescriptionRepo.deleteById(id);
    }

    private Prescription findOrThrow(UUID id) {
        return prescriptionRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prescription not found: " + id));
    }

    private PrescriptionDto.Response toResponse(Prescription p, List<PrescriptionItem> items) {
        List<PrescriptionDto.ItemResponse> itemResponses = items.stream().map(item -> {
            Medicine m = item.getMedicine();
            return PrescriptionDto.ItemResponse.builder()
                    .id(item.getId())
                    .medicineId(m != null ? m.getId() : null)
                    .medicineName(m != null ? m.getName() : null)
                    .medicineUnit(m != null ? m.getUnit() : null)
                    .medicinePrice(m != null ? m.getPrice() : null)
                    .quantity(item.getQuantity())
                    .dosage(item.getDosage())
                    .build();
        }).toList();

        return PrescriptionDto.Response.builder()
                .id(p.getId())
                .treatmentId(p.getTreatment().getId())
                .patientName(
                        p.getTreatment().getPatient() != null
                                ? p.getTreatment().getPatient().getFullName()
                                : null
                )
                .doctorName(
                        p.getTreatment().getDoctor() != null
                                ? p.getTreatment().getDoctor().getFullName()
                                : null
                )
                .note(p.getNote())
                .items(itemResponses)
                .createdAt(p.getCreatedAt())
                .build();
    }
}

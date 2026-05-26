package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.domain.model.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, UUID> {
    // prescription là object → query bằng prescription.id
    List<PrescriptionItem> findByPrescription_Id(UUID prescriptionId);
    void deleteByPrescription_Id(UUID prescriptionId);
}

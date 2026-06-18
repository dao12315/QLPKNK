package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.domain.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
    // treatment là object → query bằng treatment.id
    List<Prescription> findByTreatment_IdOrderByCreatedAtDesc(UUID treatmentId);

    List<Prescription> findByTreatment_Patient_User_IdOrderByCreatedAtDesc(UUID userId);
}

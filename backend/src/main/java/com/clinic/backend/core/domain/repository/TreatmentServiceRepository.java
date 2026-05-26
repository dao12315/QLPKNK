package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.domain.model.TreatmentService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TreatmentServiceRepository extends JpaRepository<TreatmentService, UUID> {
    // treatment là object → dùng treatment.id
    List<TreatmentService> findByTreatment_Id(UUID treatmentId);
}

package com.clinic.backend.core.domain.repository;


import com.clinic.backend.core.domain.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TreatmentRepository
        extends JpaRepository<Treatment, UUID>, JpaSpecificationExecutor<Treatment> {
    List<Treatment> findByPatient_IdOrderByCreatedAtDesc(UUID patientId);
}

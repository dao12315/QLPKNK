package com.clinic.backend.core.domain.repository;


import com.clinic.backend.core.domain.model.TreatmentSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TreatmentSessionRepository extends JpaRepository<TreatmentSession, UUID> {
    // treatment là object → dùng treatment.id
    List<TreatmentSession> findByTreatment_IdOrderByCreatedAtAsc(UUID treatmentId);
}

package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.domain.model.PatientMedicalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientMedicalInfoRepository extends JpaRepository<PatientMedicalInfo, UUID> {
    Optional<PatientMedicalInfo> findByPatient_Id(UUID patientId);
}

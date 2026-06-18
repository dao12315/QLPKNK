package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.common.base.BaseRepository;
import com.clinic.backend.core.domain.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface PatientRepository
        extends BaseRepository<Patient, UUID> {

    Page<Patient> findByUser_NameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    Optional<Patient> findByUser_Id(UUID userId);
}
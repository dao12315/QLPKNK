package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.common.base.BaseRepository;
import com.clinic.backend.core.domain.model.Doctor;
import com.clinic.backend.core.domain.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DoctorRepository
        extends BaseRepository<Doctor, UUID> {
    Page<Doctor> findByUser_NameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );
}
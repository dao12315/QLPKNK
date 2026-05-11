package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.common.base.BaseRepository;
import com.clinic.backend.core.domain.model.Patient;

import java.util.UUID;


public interface PatientRepository
        extends BaseRepository<Patient, UUID> {

}
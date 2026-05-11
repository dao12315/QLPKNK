package com.clinic.backend.core.service;

import com.clinic.backend.core.common.base.BaseMapper;
import com.clinic.backend.core.common.base.BaseServiceImpl;
import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.core.domain.model.User;
import com.clinic.backend.web.exception.BadRequestException;
import com.clinic.backend.web.dto.CreatePatientRequest;
import com.clinic.backend.web.dto.PatientFilter;
import com.clinic.backend.web.dto.PatientResponse;
import com.clinic.backend.core.domain.repository.PatientRepository;
import com.clinic.backend.core.domain.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class PatientService extends BaseServiceImpl<
        Patient,
        CreatePatientRequest,
        PatientResponse,
        PatientFilter,
        UUID
        > {

    private final PatientRepository patientRepository;
    private final BaseMapper<Patient, CreatePatientRequest, PatientResponse> mapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientService(PatientRepository repository,
                          BaseMapper<Patient, CreatePatientRequest, PatientResponse> mapper,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        super(repository, mapper);
        this.patientRepository = repository;
        this.mapper = mapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= CREATE =================
    @Transactional
    @Override
    public PatientResponse create(CreatePatientRequest req) {

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();

        user.setName(req.getName());
        user.setEmail(req.getEmail());

        user.setPassword(
                passwordEncoder.encode(req.getPassword())
        );

        user.setRole("patient");

        user.setStatus("active");

        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        user = userRepository.saveAndFlush(user);

        Patient patient = mapper.toEntity(req);
        patient.setCreatedAt(Instant.now());
        patient.setUpdatedAt(Instant.now());
        patient.setUser(user);

        patient = patientRepository.saveAndFlush(patient);

        return mapper.toResponse(patient);
    }
    // ================= UPDATE =================
    @Transactional
    @Override
    public PatientResponse update(UUID id, CreatePatientRequest req) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // update patient fields
        mapper.update(patient, req);

        // update user nếu cần
        User user = patient.getUser();
        if (user != null) {

            if (req.getName() != null) {
                user.setName(req.getName());
            }

            if (req.getEmail() != null &&
                    !req.getEmail().equals(user.getEmail())) {

                if (userRepository.findByEmail(req.getEmail()).isPresent()) {
                    throw new BadRequestException("Email already exists");
                }

                user.setEmail(req.getEmail());
            }

            if (req.getPassword() != null) {
                user.setPassword(
                        passwordEncoder.encode(req.getPassword())
                );
            }

            user.setUpdatedAt(Instant.now());
        }

        patient = patientRepository.saveAndFlush(patient);

        return mapper.toResponse(patient);
    }

    // ================= DELETE =================
    @Transactional
    @Override
    public void delete(UUID id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // nếu muốn xoá cả user
        User user = patient.getUser();

        patientRepository.delete(patient);

        if (user != null) {
            userRepository.delete(user);
        }
    }

    // ================= GET BY ID =================
    @Override
    public PatientResponse getById(UUID id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return mapper.toResponse(patient);
    }
}
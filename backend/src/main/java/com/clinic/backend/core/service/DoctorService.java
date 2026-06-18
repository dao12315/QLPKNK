package com.clinic.backend.core.service;

import com.clinic.backend.core.common.base.BaseMapper;
import com.clinic.backend.core.common.base.BaseServiceImpl;
import com.clinic.backend.core.domain.model.Doctor;
import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.core.domain.model.User;
import com.clinic.backend.core.domain.repository.DoctorRepository;
import com.clinic.backend.core.domain.repository.UserRepository;
import com.clinic.backend.web.dto.*;
import com.clinic.backend.web.exception.BadRequestException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class DoctorService extends BaseServiceImpl<
        Doctor,
        CreateDoctorRequest,
        DoctorResponse,
        DoctorFilter,
        UUID
        > {

    private final DoctorRepository doctorRepository;
    private final BaseMapper<Doctor,
            CreateDoctorRequest,
            DoctorResponse> mapper;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(
            DoctorRepository repository,
            BaseMapper<Doctor,
                    CreateDoctorRequest,
                    DoctorResponse> mapper,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        super(repository, mapper);

        this.doctorRepository = repository;
        this.mapper = mapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= CREATE =================

    @Transactional
    @Override
    public DoctorResponse create(CreateDoctorRequest req) {

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();

        user.setName(req.getName() != null ? req.getName() : req.getFullName());
        user.setEmail(req.getEmail());

        user.setPassword(
                passwordEncoder.encode(req.getPassword())
        );

        user.setRole("dentist");
        user.setStatus("active");

        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        user = userRepository.saveAndFlush(user);

        Doctor doctor = mapper.toEntity(req);

        doctor.setUser(user);

        doctor.setCreatedAt(Instant.now());
        doctor.setUpdatedAt(Instant.now());

        doctor = doctorRepository.saveAndFlush(doctor);

        return mapper.toResponse(doctor);
    }

    // ================= UPDATE =================

    @Transactional
    @Override
    public DoctorResponse update(UUID id,
                                 CreateDoctorRequest req) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        mapper.update(doctor, req);

        User user = doctor.getUser();

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

        doctor.setUpdatedAt(Instant.now());

        doctor = doctorRepository.saveAndFlush(doctor);

        return mapper.toResponse(doctor);
    }

    // ================= DELETE =================

    @Transactional
    @Override
    public void delete(UUID id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        User user = doctor.getUser();

        doctorRepository.delete(doctor);

        if (user != null) {
            userRepository.delete(user);
        }
    }
    @Override
    public DoctorResponse getById(UUID id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return mapper.toResponse(doctor);
    }

    @Override
    public Page<DoctorResponse> search(DoctorFilter filter) {

        Pageable pageable = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "id")
        );

        Page<Doctor> doctors;

        if (filter.getKeyword() != null &&
                !filter.getKeyword().isBlank()) {

            doctors = doctorRepository
                    .findByUser_NameContainingIgnoreCase(
                            filter.getKeyword(),
                            pageable
                    );

        } else {

            doctors = doctorRepository.findAll(pageable);
        }

        return doctors.map(mapper::toResponse);
    }
}

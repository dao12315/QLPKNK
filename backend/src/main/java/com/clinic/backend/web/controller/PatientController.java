package com.clinic.backend.web.controller;

import com.clinic.backend.core.common.base.BaseController;
import com.clinic.backend.core.service.PatientDentalInfoService;
import com.clinic.backend.core.service.PatientMedicalInfoService;
import com.clinic.backend.web.dto.CreatePatientRequest;
import com.clinic.backend.web.dto.PatientDentalInfoDto;
import com.clinic.backend.web.dto.PatientFilter;
import com.clinic.backend.web.dto.PatientMedicalInfoDto;
import com.clinic.backend.web.dto.PatientResponse;
import com.clinic.backend.core.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
public class PatientController extends BaseController<CreatePatientRequest, PatientResponse, PatientFilter, UUID> {

    private final PatientService patientService;
    private final PatientMedicalInfoService medicalInfoService;
    private final PatientDentalInfoService dentalInfoService;

    public PatientController(PatientService service,
            PatientMedicalInfoService medicalInfoService,
            PatientDentalInfoService dentalInfoService) {
        super(service);
        this.patientService = service;
        this.medicalInfoService = medicalInfoService;
        this.dentalInfoService = dentalInfoService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('patient', 'admin', 'receptionist', 'dentist')")
    public PatientResponse getMe(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return patientService.getMe(userId);
    }

    @GetMapping("/{patientId}/medical-info")
    @PreAuthorize("hasAnyAuthority('admin', 'receptionist', 'dentist')")
    public PatientMedicalInfoDto.Response getMedicalInfo(@PathVariable UUID patientId) {
        return medicalInfoService.get(patientId);
    }

    @PutMapping("/{patientId}/medical-info")
    @PreAuthorize("hasAnyAuthority('admin', 'receptionist', 'dentist')")
    public PatientMedicalInfoDto.Response updateMedicalInfo(
            @PathVariable UUID patientId,
            @Valid @RequestBody PatientMedicalInfoDto.Request request) {
        return medicalInfoService.upsert(patientId, request);
    }

    @GetMapping("/{patientId}/dental-info")
    @PreAuthorize("hasAnyAuthority('admin', 'receptionist', 'dentist')")
    public PatientDentalInfoDto.Response getDentalInfo(@PathVariable UUID patientId) {
        return dentalInfoService.get(patientId);
    }

    @PutMapping("/{patientId}/dental-info")
    @PreAuthorize("hasAnyAuthority('admin', 'receptionist', 'dentist')")
    public PatientDentalInfoDto.Response updateDentalInfo(
            @PathVariable UUID patientId,
            @Valid @RequestBody PatientDentalInfoDto.Request request) {
        return dentalInfoService.upsert(patientId, request);
    }
}
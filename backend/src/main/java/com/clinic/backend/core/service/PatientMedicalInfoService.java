package com.clinic.backend.core.service;

import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.core.domain.model.PatientMedicalInfo;
import com.clinic.backend.core.domain.repository.PatientMedicalInfoRepository;
import com.clinic.backend.core.domain.repository.PatientRepository;
import com.clinic.backend.web.dto.PatientMedicalInfoDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientMedicalInfoService {
    private final PatientRepository patientRepo;
    private final PatientMedicalInfoRepository medicalInfoRepo;

    @Transactional(readOnly = true)
    public PatientMedicalInfoDto.Response get(UUID patientId) {
        ensurePatientExists(patientId);
        return medicalInfoRepo.findByPatient_Id(patientId)
                .map(this::toResponse)
                .orElseGet(() -> emptyResponse(patientId));
    }

    public PatientMedicalInfoDto.Response upsert(UUID patientId, PatientMedicalInfoDto.Request req) {
        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found: " + patientId));

        PatientMedicalInfo info = medicalInfoRepo.findByPatient_Id(patientId)
                .orElseGet(() -> {
                    PatientMedicalInfo created = new PatientMedicalInfo();
                    created.setPatient(patient);
                    created.setCreatedAt(Instant.now());
                    return created;
                });

        apply(info, req);
        info.setUpdatedAt(Instant.now());
        return toResponse(medicalInfoRepo.saveAndFlush(info));
    }

    private void ensurePatientExists(UUID patientId) {
        if (!patientRepo.existsById(patientId)) {
            throw new EntityNotFoundException("Patient not found: " + patientId);
        }
    }

    private void apply(PatientMedicalInfo info, PatientMedicalInfoDto.Request req) {
        info.setMedicalHistory(req.getMedicalHistory());
        info.setAllergies(req.getAllergies());
        info.setCurrentMedications(req.getCurrentMedications());
        info.setChronicDiseases(req.getChronicDiseases());
        info.setPastSurgeries(req.getPastSurgeries());
        info.setBloodPressure(req.getBloodPressure());
        info.setHeartDisease(defaultFalse(req.getHeartDisease()));
        info.setDiabetes(defaultFalse(req.getDiabetes()));
        info.setHepatitis(defaultFalse(req.getHepatitis()));
        info.setAsthma(defaultFalse(req.getAsthma()));
        info.setIsPregnant(defaultFalse(req.getIsPregnant()));
        info.setIsBreastfeeding(defaultFalse(req.getIsBreastfeeding()));
        info.setMedicalNote(req.getMedicalNote());
    }

    private PatientMedicalInfoDto.Response toResponse(PatientMedicalInfo info) {
        return PatientMedicalInfoDto.Response.builder()
                .id(info.getId())
                .patientId(info.getPatient() != null ? info.getPatient().getId() : null)
                .medicalHistory(text(info.getMedicalHistory()))
                .allergies(text(info.getAllergies()))
                .currentMedications(text(info.getCurrentMedications()))
                .chronicDiseases(text(info.getChronicDiseases()))
                .pastSurgeries(text(info.getPastSurgeries()))
                .bloodPressure(text(info.getBloodPressure()))
                .heartDisease(defaultFalse(info.getHeartDisease()))
                .diabetes(defaultFalse(info.getDiabetes()))
                .hepatitis(defaultFalse(info.getHepatitis()))
                .asthma(defaultFalse(info.getAsthma()))
                .isPregnant(defaultFalse(info.getIsPregnant()))
                .isBreastfeeding(defaultFalse(info.getIsBreastfeeding()))
                .medicalNote(text(info.getMedicalNote()))
                .createdAt(info.getCreatedAt())
                .updatedAt(info.getUpdatedAt())
                .build();
    }

    private PatientMedicalInfoDto.Response emptyResponse(UUID patientId) {
        return PatientMedicalInfoDto.Response.builder()
                .patientId(patientId)
                .medicalHistory("")
                .allergies("")
                .currentMedications("")
                .chronicDiseases("")
                .pastSurgeries("")
                .bloodPressure("")
                .heartDisease(false)
                .diabetes(false)
                .hepatitis(false)
                .asthma(false)
                .isPregnant(false)
                .isBreastfeeding(false)
                .medicalNote("")
                .build();
    }

    private Boolean defaultFalse(Boolean value) {
        return Boolean.TRUE.equals(value);
    }

    private String text(String value) {
        return value != null ? value : "";
    }
}

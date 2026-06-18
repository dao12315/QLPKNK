package com.clinic.backend.core.service;

import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.core.domain.model.PatientDentalInfo;
import com.clinic.backend.core.domain.repository.PatientDentalInfoRepository;
import com.clinic.backend.core.domain.repository.PatientRepository;
import com.clinic.backend.web.dto.PatientDentalInfoDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientDentalInfoService {
    private final PatientRepository patientRepo;
    private final PatientDentalInfoRepository dentalInfoRepo;

    @Transactional(readOnly = true)
    public PatientDentalInfoDto.Response get(UUID patientId) {
        ensurePatientExists(patientId);
        return dentalInfoRepo.findByPatient_Id(patientId)
                .map(this::toResponse)
                .orElseGet(() -> emptyResponse(patientId));
    }

    public PatientDentalInfoDto.Response upsert(UUID patientId, PatientDentalInfoDto.Request req) {
        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found: " + patientId));

        PatientDentalInfo info = dentalInfoRepo.findByPatient_Id(patientId)
                .orElseGet(() -> {
                    PatientDentalInfo created = new PatientDentalInfo();
                    created.setPatient(patient);
                    created.setCreatedAt(Instant.now());
                    return created;
                });

        apply(info, req);
        info.setUpdatedAt(Instant.now());
        return toResponse(dentalInfoRepo.saveAndFlush(info));
    }

    private void ensurePatientExists(UUID patientId) {
        if (!patientRepo.existsById(patientId)) {
            throw new EntityNotFoundException("Patient not found: " + patientId);
        }
    }

    private void apply(PatientDentalInfo info, PatientDentalInfoDto.Request req) {
        info.setChiefComplaint(req.getChiefComplaint());
        info.setDentalHistory(req.getDentalHistory());
        info.setToothPainLocation(req.getToothPainLocation());
        info.setPainLevel(req.getPainLevel());
        info.setGumBleeding(defaultFalse(req.getGumBleeding()));
        info.setToothSensitivity(defaultFalse(req.getToothSensitivity()));
        info.setBadBreath(defaultFalse(req.getBadBreath()));
        info.setCavities(defaultFalse(req.getCavities()));
        info.setBrushingFrequency(req.getBrushingFrequency());
        info.setFlossingHabit(req.getFlossingHabit());
        info.setDentalNote(req.getDentalNote());
    }

    private PatientDentalInfoDto.Response toResponse(PatientDentalInfo info) {
        return PatientDentalInfoDto.Response.builder()
                .id(info.getId())
                .patientId(info.getPatient() != null ? info.getPatient().getId() : null)
                .chiefComplaint(text(info.getChiefComplaint()))
                .dentalHistory(text(info.getDentalHistory()))
                .toothPainLocation(text(info.getToothPainLocation()))
                .painLevel(info.getPainLevel())
                .gumBleeding(defaultFalse(info.getGumBleeding()))
                .toothSensitivity(defaultFalse(info.getToothSensitivity()))
                .badBreath(defaultFalse(info.getBadBreath()))
                .cavities(defaultFalse(info.getCavities()))
                .brushingFrequency(text(info.getBrushingFrequency()))
                .flossingHabit(text(info.getFlossingHabit()))
                .dentalNote(text(info.getDentalNote()))
                .createdAt(info.getCreatedAt())
                .updatedAt(info.getUpdatedAt())
                .build();
    }

    private PatientDentalInfoDto.Response emptyResponse(UUID patientId) {
        return PatientDentalInfoDto.Response.builder()
                .patientId(patientId)
                .chiefComplaint("")
                .dentalHistory("")
                .toothPainLocation("")
                .gumBleeding(false)
                .toothSensitivity(false)
                .badBreath(false)
                .cavities(false)
                .brushingFrequency("")
                .flossingHabit("")
                .dentalNote("")
                .build();
    }

    private Boolean defaultFalse(Boolean value) {
        return Boolean.TRUE.equals(value);
    }

    private String text(String value) {
        return value != null ? value : "";
    }
}

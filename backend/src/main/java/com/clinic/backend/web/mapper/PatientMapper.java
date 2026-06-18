package com.clinic.backend.web.mapper;

import com.clinic.backend.core.common.base.BaseMapperImpl;
import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.core.domain.model.User;
import com.clinic.backend.web.dto.CreatePatientRequest;
import com.clinic.backend.web.dto.PatientResponse;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper extends BaseMapperImpl<
        Patient,
        CreatePatientRequest,
        PatientResponse
        > {

    @Override
    public Patient toEntity(CreatePatientRequest req) {

        Patient p = new Patient();

        p.setFullName(resolveName(req));
        p.setPhone(req.getPhone());
        p.setEmail(req.getEmail());
        p.setGender(req.getGender());
        p.setDateOfBirth(req.getDateOfBirth() != null ? req.getDateOfBirth() : req.getDob());
        p.setAddress(req.getAddress());
        p.setMedicalHistory(req.getMedicalHistory());
        p.setIdentityNumber(req.getIdentityNumber());
        p.setOccupation(req.getOccupation());
        p.setEmergencyContactName(req.getEmergencyContactName());
        p.setEmergencyContactPhone(req.getEmergencyContactPhone());
        p.setEmergencyContactRelationship(req.getEmergencyContactRelationship());
        p.setStatus(req.getStatus() != null ? req.getStatus() : "active");
        p.setNote(req.getNote());

        return p;
    }

    @Override
    public PatientResponse toResponse(Patient entity) {

        PatientResponse res = new PatientResponse();

        res.setPatientId(entity.getId());

        res.setName(entity.getFullName());
        res.setFullName(entity.getFullName());
        res.setEmail(entity.getEmail());

        res.setPhone(entity.getPhone());

        res.setGender(entity.getGender());

        res.setDob(entity.getDateOfBirth());
        res.setDateOfBirth(entity.getDateOfBirth());

        res.setAddress(entity.getAddress());

        res.setMedicalHistory(entity.getMedicalHistory());
        res.setIdentityNumber(entity.getIdentityNumber());
        res.setOccupation(entity.getOccupation());
        res.setEmergencyContactName(entity.getEmergencyContactName());
        res.setEmergencyContactPhone(entity.getEmergencyContactPhone());
        res.setEmergencyContactRelationship(entity.getEmergencyContactRelationship());
        res.setStatus(entity.getStatus());
        res.setNote(entity.getNote());
        res.setCreatedAt(entity.getCreatedAt());
        res.setUpdatedAt(entity.getUpdatedAt());

        // FIX: Patient không có getUserId()
        if (entity.getUser() != null) {

            User user = entity.getUser();

            res.setUserId(user.getId());

            res.setName(user.getName());
            if (res.getFullName() == null) {
                res.setFullName(user.getName());
            }

            res.setEmail(user.getEmail());

            res.setRole(user.getRole());
        }

        return res;
    }

    @Override
    public void update(Patient entity, CreatePatientRequest req) {

        if (req.getName() != null || req.getFullName() != null) {
            entity.setFullName(resolveName(req));
        }

        if (req.getPhone() != null) {
            entity.setPhone(req.getPhone());
        }

        if (req.getEmail() != null) {
            entity.setEmail(req.getEmail());
        }

        if (req.getGender() != null) {
            entity.setGender(req.getGender());
        }

        if (req.getDob() != null || req.getDateOfBirth() != null) {
            entity.setDateOfBirth(req.getDateOfBirth() != null ? req.getDateOfBirth() : req.getDob());
        }

        if (req.getAddress() != null) {
            entity.setAddress(req.getAddress());
        }

        if (req.getMedicalHistory() != null) {
            entity.setMedicalHistory(req.getMedicalHistory());
        }

        if (req.getIdentityNumber() != null) entity.setIdentityNumber(req.getIdentityNumber());
        if (req.getOccupation() != null) entity.setOccupation(req.getOccupation());
        if (req.getEmergencyContactName() != null) entity.setEmergencyContactName(req.getEmergencyContactName());
        if (req.getEmergencyContactPhone() != null) entity.setEmergencyContactPhone(req.getEmergencyContactPhone());
        if (req.getEmergencyContactRelationship() != null) entity.setEmergencyContactRelationship(req.getEmergencyContactRelationship());
        if (req.getStatus() != null) entity.setStatus(req.getStatus());
        if (req.getNote() != null) entity.setNote(req.getNote());
    }

    private String resolveName(CreatePatientRequest req) {
        return req.getFullName() != null ? req.getFullName() : req.getName();
    }
}

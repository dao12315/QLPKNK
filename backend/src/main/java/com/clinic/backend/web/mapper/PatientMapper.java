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

        p.setFullName(req.getName());
        p.setPhone(req.getPhone());
        p.setGender(req.getGender());
        p.setDateOfBirth(req.getDob());
        p.setAddress(req.getAddress());
        p.setMedicalHistory(req.getMedicalHistory());

        return p;
    }

    @Override
    public PatientResponse toResponse(Patient entity) {

        PatientResponse res = new PatientResponse();

        res.setPatientId(entity.getId());

        res.setName(entity.getFullName());

        res.setPhone(entity.getPhone());

        res.setGender(entity.getGender());

        res.setDob(entity.getDateOfBirth());

        res.setAddress(entity.getAddress());

        res.setMedicalHistory(entity.getMedicalHistory());

        // FIX: Patient không có getUserId()
        if (entity.getUser() != null) {

            User user = entity.getUser();

            res.setUserId(user.getId());

            res.setName(user.getName());

            res.setEmail(user.getEmail());

            res.setRole(user.getRole());
        }

        return res;
    }

    @Override
    public void update(Patient entity, CreatePatientRequest req) {

        if (req.getName() != null) {
            entity.setFullName(req.getName());
        }

        if (req.getPhone() != null) {
            entity.setPhone(req.getPhone());
        }

        if (req.getGender() != null) {
            entity.setGender(req.getGender());
        }

        if (req.getDob() != null) {
            entity.setDateOfBirth(req.getDob());
        }

        if (req.getAddress() != null) {
            entity.setAddress(req.getAddress());
        }

        if (req.getMedicalHistory() != null) {
            entity.setMedicalHistory(req.getMedicalHistory());
        }
    }
}
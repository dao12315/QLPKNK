package com.clinic.backend.web.mapper;


import com.clinic.backend.core.common.base.BaseMapper;
import com.clinic.backend.core.common.base.BaseMapperImpl;
import com.clinic.backend.core.domain.model.Doctor;
import com.clinic.backend.web.dto.CreateDoctorRequest;
import com.clinic.backend.web.dto.DoctorResponse;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper extends BaseMapperImpl<
        Doctor,
        CreateDoctorRequest,
        DoctorResponse> {

    @Override
    public Doctor toEntity(CreateDoctorRequest req) {

        Doctor doctor = new Doctor();

        doctor.setFullName(req.getFullName() != null ? req.getFullName() : req.getName());
        doctor.setSpecialization(req.getSpecialization());
        doctor.setLicenseNumber(req.getLicenseNumber());
        doctor.setDegree(req.getDegree());
        doctor.setExperienceYears(req.getExperienceYears());
        doctor.setYearsOfExperience(req.getYearsOfExperience() != null ? req.getYearsOfExperience() : req.getExperienceYears());
        doctor.setRoom(req.getRoom());
        doctor.setPhone(req.getPhone());

        return doctor;
    }

    @Override
    public DoctorResponse toResponse(Doctor doctor) {

        return DoctorResponse.builder()
                .id(doctor.getId())
                .userId(doctor.getUser().getId())
                .fullName(doctor.getFullName())
                .specialization(doctor.getSpecialization())
                .licenseNumber(doctor.getLicenseNumber())
                .degree(doctor.getDegree())
                .experienceYears(doctor.getExperienceYears())
                .yearsOfExperience(doctor.getYearsOfExperience() != null ? doctor.getYearsOfExperience() : doctor.getExperienceYears())
                .room(doctor.getRoom())
                .phone(doctor.getPhone())
                .createdAt(doctor.getCreatedAt())
                .updatedAt(doctor.getUpdatedAt())
                .build();
    }

    @Override
    public void update(Doctor doctor, CreateDoctorRequest req) {

        if (req.getFullName() != null) {
            doctor.setFullName(req.getFullName());
        }

        if (req.getSpecialization() != null) {
            doctor.setSpecialization(req.getSpecialization());
        }

        if (req.getLicenseNumber() != null) {
            doctor.setLicenseNumber(req.getLicenseNumber());
        }

        if (req.getDegree() != null) {
            doctor.setDegree(req.getDegree());
        }

        if (req.getExperienceYears() != null) {
            doctor.setExperienceYears(req.getExperienceYears());
        }

        if (req.getYearsOfExperience() != null) {
            doctor.setYearsOfExperience(req.getYearsOfExperience());
        }

        if (req.getRoom() != null) {
            doctor.setRoom(req.getRoom());
        }

        if (req.getPhone() != null) {
            doctor.setPhone(req.getPhone());
        }
    }
}

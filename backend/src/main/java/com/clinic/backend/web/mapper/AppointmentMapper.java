package com.clinic.backend.web.mapper;


import com.clinic.backend.core.domain.model.Appointment;
import com.clinic.backend.core.domain.model.Chair;
import com.clinic.backend.core.domain.model.Doctor;
import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.web.dto.AppointmentDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AppointmentMapper {

    /**
     * Chuyển Response DTO từ Appointment entity.
     * Entity dùng object references (patient, doctor, chair) nên
     * phải null-check trước khi lấy id/name.
     */
    public AppointmentDto.Response toResponse(Appointment a) {
        Patient patient = a.getPatient();
        Doctor  doctor  = a.getDoctor();
        Appointment from = a.getRescheduledFrom(); // self-reference object

        return AppointmentDto.Response.builder()
                .id(a.getId())
                // Patient
                .patientId(patient != null ? patient.getId() : null)
                .patientName(patient != null ? patient.getFullName() : null)
                .patientPhone(patient != null ? patient.getPhone() : null)
                // Doctor
                .doctorId(doctor != null ? doctor.getId() : null)
                .doctorName(doctor != null ? doctor.getFullName() : null)
                // Times & status
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .status(a.getStatus())
                .note(a.getNote())
                .cancellationReason(a.getCancellationReason())
                // rescheduledFrom là Appointment object → chỉ lấy ID để trả về
                .rescheduledFromId(from != null ? from.getId() : null)
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }

    public List<AppointmentDto.Response> toList(List<Appointment> list) {
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
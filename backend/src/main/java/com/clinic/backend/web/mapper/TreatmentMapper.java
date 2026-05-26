package com.clinic.backend.web.mapper;


import com.clinic.backend.core.domain.model.*;
import com.clinic.backend.web.dto.TreatmentDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TreatmentMapper {

    public TreatmentDto.Response toResponse(Treatment t,
                                            List<TreatmentSession> sessions,
                                            List<TreatmentService> serviceItems) {
        Patient patient = t.getPatient();
        Doctor  doctor  = t.getDoctor();

        return TreatmentDto.Response.builder()
                .id(t.getId())
                .patientId(patient != null ? patient.getId() : null)
                .patientName(patient != null ? patient.getFullName() : null)
                .doctorId(doctor != null ? doctor.getId() : null)
                .doctorName(doctor != null ? doctor.getFullName() : null)
                .status(t.getStatus())
                .diagnosis(t.getDiagnosis())
                .note(t.getNote())
                .toothCodes(t.getToothCodes())   // List<String> – trả thẳng
                .toothNote(t.getToothNote())
                .sessions(sessions == null ? List.of()
                        : sessions.stream().map(this::toSessionResponse).collect(Collectors.toList()))
                .serviceItems(serviceItems == null ? List.of()
                        : serviceItems.stream().map(this::toServiceItemResponse).collect(Collectors.toList()))
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }

    public TreatmentDto.SessionResponse toSessionResponse(TreatmentSession s) {
        Appointment appt = s.getAppointment(); // nullable object
        return TreatmentDto.SessionResponse.builder()
                .id(s.getId())
                .treatmentId(s.getTreatment().getId())
                .appointmentId(appt != null ? appt.getId() : null)
                .appointmentStatus(appt != null ? appt.getStatus() : null)
                .note(s.getNote())
                .createdAt(s.getCreatedAt())
                .build();
    }

    public TreatmentDto.ServiceItemResponse toServiceItemResponse(TreatmentService ts) {
        DentalService svc = ts.getDentalService(); // nullable – có thể là dịch vụ tùy chỉnh
        return TreatmentDto.ServiceItemResponse.builder()
                .id(ts.getId())
                .treatmentId(ts.getTreatment().getId())
                .serviceId(svc != null ? svc.getId() : null)
                .serviceName(ts.getServiceName())
                .quantity(ts.getQuantity())
                .unitPrice(ts.getUnitPrice())
                .total(ts.getUnitPrice().multiply(java.math.BigDecimal.valueOf(ts.getQuantity())))
                .build();
    }
}
package com.clinic.backend.web.mapper;

import com.clinic.backend.core.domain.model.Appointment;
import com.clinic.backend.core.domain.model.DentalService;
import com.clinic.backend.core.domain.model.Doctor;
import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.core.domain.model.Treatment;
import com.clinic.backend.core.domain.model.TreatmentService;
import com.clinic.backend.core.domain.model.TreatmentSession;
import com.clinic.backend.web.dto.TreatmentDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TreatmentMapper {

    public TreatmentDto.Response toResponse(Treatment t,
                                            List<TreatmentSession> sessions,
                                            List<TreatmentService> serviceItems) {
        Patient patient = t.getPatient();
        Doctor doctor = t.getDoctor();

        return TreatmentDto.Response.builder()
                .id(t.getId())
                .patientId(patient != null ? patient.getId() : null)
                .patientName(patient != null ? patient.getFullName() : null)
                .doctorId(doctor != null ? doctor.getId() : null)
                .doctorName(doctor != null ? doctor.getFullName() : null)
                .status(t.getStatus())
                .chiefComplaint(t.getChiefComplaint())
                .clinicalExamination(t.getClinicalExamination())
                .diagnosis(t.getDiagnosis())
                .treatmentPlan(t.getTreatmentPlan())
                .note(t.getNote())
                .notes(t.getNote())
                .toothCodes(t.getToothCodes())
                .toothNote(t.getToothNote())
                .resultNote(t.getResultNote())
                .doctorNote(t.getDoctorNote())
                .followUpDate(t.getFollowUpDate())
                .startedAt(t.getStartedAt())
                .completedAt(t.getCompletedAt())
                .sessions(sessions == null ? List.of()
                        : sessions.stream().map(this::toSessionResponse).collect(Collectors.toList()))
                .serviceItems(serviceItems == null ? List.of()
                        : serviceItems.stream().map(this::toServiceItemResponse).collect(Collectors.toList()))
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }

    public TreatmentDto.SessionResponse toSessionResponse(TreatmentSession s) {
        Appointment appt = s.getAppointment();
        return TreatmentDto.SessionResponse.builder()
                .id(s.getId())
                .treatmentId(s.getTreatment().getId())
                .appointmentId(appt != null ? appt.getId() : null)
                .appointmentStatus(appt != null ? appt.getStatus() : null)
                .note(s.getNote())
                .sessionDate(s.getSessionDate())
                .procedurePerformed(s.getProcedurePerformed())
                .doctorNote(s.getDoctorNote())
                .patientResponse(s.getPatientResponse())
                .nextAppointmentDate(s.getNextAppointmentDate())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    public TreatmentDto.ServiceItemResponse toServiceItemResponse(TreatmentService ts) {
        DentalService svc = ts.getDentalService();
        BigDecimal subtotal = ts.getSubtotal() != null
                ? ts.getSubtotal()
                : ts.getUnitPrice().multiply(BigDecimal.valueOf(ts.getQuantity()));
        return TreatmentDto.ServiceItemResponse.builder()
                .id(ts.getId())
                .treatmentId(ts.getTreatment().getId())
                .serviceId(svc != null ? svc.getId() : null)
                .serviceName(ts.getServiceName())
                .quantity(ts.getQuantity())
                .unitPrice(ts.getUnitPrice())
                .toothCode(ts.getToothCode())
                .discountAmount(ts.getDiscountAmount())
                .subtotal(subtotal)
                .note(ts.getNote())
                .createdAt(ts.getCreatedAt())
                .total(subtotal)
                .build();
    }
}

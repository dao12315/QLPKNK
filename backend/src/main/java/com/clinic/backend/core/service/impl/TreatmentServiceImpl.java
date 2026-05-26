package com.clinic.backend.core.service.impl;


import com.clinic.backend.core.domain.model.*;
import com.clinic.backend.core.domain.repository.*;
import com.clinic.backend.web.dto.TreatmentDto;
import com.clinic.backend.web.mapper.TreatmentMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TreatmentServiceImpl {

    private final TreatmentRepository treatmentRepo;
    private final TreatmentSessionRepository  sessionRepo;
    private final TreatmentServiceRepository serviceItemRepo;
    private final TreatmentMapper mapper;
    private final PatientRepository           patientRepo;
    private final DoctorRepository            doctorRepo;
    private final ServiceRepository           serviceRepo;
    private final AppointmentRepository       appointmentRepo;

    // ─── UC15 – Tạo hồ sơ điều trị ───────────────────────────
    public TreatmentDto.Response create(TreatmentDto.CreateRequest req) {
        Patient patient = patientRepo.findById(req.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found: " + req.getPatientId()));
        Doctor doctor = doctorRepo.findById(req.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found: " + req.getDoctorId()));

        Treatment t = new Treatment();
        t.setPatient(patient);
        t.setDoctor(doctor);
        t.setStatus("planned");
        t.setDiagnosis(req.getDiagnosis());
        t.setNote(req.getNote());
        t.setToothCodes(req.getToothCodes());
        t.setToothNote(req.getToothNote());
        t.setCreatedAt(Instant.now());
        t.setUpdatedAt(Instant.now());

        Treatment saved = treatmentRepo.saveAndFlush(t);
        return mapper.toResponse(saved, List.of(), List.of());
    }

    // ─── UC15 – Cập nhật hồ sơ ───────────────────────────────
    public TreatmentDto.Response update(UUID id, TreatmentDto.UpdateRequest req) {
        Treatment t = findOrThrow(id);
        if (req.getStatus()     != null) t.setStatus(req.getStatus());
        if (req.getDiagnosis()  != null) t.setDiagnosis(req.getDiagnosis());
        if (req.getNote()       != null) t.setNote(req.getNote());
        if (req.getToothCodes() != null) t.setToothCodes(req.getToothCodes());
        if (req.getToothNote()  != null) t.setToothNote(req.getToothNote());
        t.setUpdatedAt(Instant.now());
        return toFullResponse(treatmentRepo.saveAndFlush(t));
    }

    @Transactional(readOnly = true)
    public TreatmentDto.Response getById(UUID id) {
        return toFullResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<TreatmentDto.Response> search(TreatmentDto.Filter filter) {
        String[] parts = filter.getSort().split(",");
        Sort sort = Sort.by(
                parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                        ? Sort.Direction.DESC : Sort.Direction.ASC, parts[0]);
        PageRequest pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Specification<Treatment> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.getPatientId() != null)
                predicates.add(cb.equal(root.get("patient").get("id"), filter.getPatientId()));
            if (filter.getDoctorId() != null)
                predicates.add(cb.equal(root.get("doctor").get("id"), filter.getDoctorId()));
            if (filter.getStatus() != null && !filter.getStatus().isBlank())
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return treatmentRepo.findAll(spec, pageable).map(this::toFullResponse);
    }

    // ─── UC16 – Ghi nhận phiên điều trị ──────────────────────
    public TreatmentDto.SessionResponse addSession(TreatmentDto.SessionRequest req) {
        Treatment treatment = findOrThrow(req.getTreatmentId());

        Appointment appointment = null;
        if (req.getAppointmentId() != null) {
            // appointment là object reference trong TreatmentSession
            appointment = appointmentRepo.findById(req.getAppointmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found: " + req.getAppointmentId()));
        }

        TreatmentSession session = new TreatmentSession();
        session.setTreatment(treatment);      // object reference
        session.setAppointment(appointment);  // object reference (nullable)
        session.setNote(req.getNote());
        session.setCreatedAt(Instant.now());

        return mapper.toSessionResponse(sessionRepo.saveAndFlush(session));
    }

    @Transactional(readOnly = true)
    public List<TreatmentDto.SessionResponse> getSessions(UUID treatmentId) {
        findOrThrow(treatmentId);
        return sessionRepo.findByTreatment_IdOrderByCreatedAtAsc(treatmentId)
                .stream().map(mapper::toSessionResponse).toList();
    }

    public void deleteSession(UUID sessionId) {
        if (!sessionRepo.existsById(sessionId))
            throw new EntityNotFoundException("Session not found: " + sessionId);
        sessionRepo.deleteById(sessionId);
    }

    // ─── UC17 – Chỉ định dịch vụ điều trị ────────────────────
    public TreatmentDto.ServiceItemResponse addServiceItem(TreatmentDto.ServiceItemRequest req) {
        Treatment treatment = findOrThrow(req.getTreatmentId());

        DentalService service = null;
        if (req.getServiceId() != null) {
            // service là object reference trong TreatmentService
            service = serviceRepo.findById(req.getServiceId())
                    .orElseThrow(() -> new EntityNotFoundException("Service not found: " + req.getServiceId()));
        }

        TreatmentService ts = new TreatmentService();
        ts.setTreatment(treatment);   // object reference
        ts.setDentalService(service);       // object reference (nullable)
        ts.setServiceName(req.getServiceName());
        ts.setQuantity(req.getQuantity());
        ts.setUnitPrice(req.getUnitPrice());

        return mapper.toServiceItemResponse(serviceItemRepo.saveAndFlush(ts));
    }

    public TreatmentDto.ServiceItemResponse updateServiceItem(UUID itemId, TreatmentDto.ServiceItemRequest req) {
        TreatmentService ts = serviceItemRepo.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Service item not found: " + itemId));
        if (req.getServiceName() != null) ts.setServiceName(req.getServiceName());
        if (req.getQuantity()    != null) ts.setQuantity(req.getQuantity());
        if (req.getUnitPrice()   != null) ts.setUnitPrice(req.getUnitPrice());
        return mapper.toServiceItemResponse(serviceItemRepo.saveAndFlush(ts));
    }

    public void deleteServiceItem(UUID itemId) {
        if (!serviceItemRepo.existsById(itemId))
            throw new EntityNotFoundException("Service item not found: " + itemId);
        serviceItemRepo.deleteById(itemId);
    }

    @Transactional(readOnly = true)
    public List<TreatmentDto.ServiceItemResponse> getServiceItems(UUID treatmentId) {
        findOrThrow(treatmentId);
        return serviceItemRepo.findByTreatment_Id(treatmentId)
                .stream().map(mapper::toServiceItemResponse).toList();
    }

    // ─── Helpers ─────────────────────────────────────────────
    private Treatment findOrThrow(UUID id) {
        return treatmentRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Treatment not found: " + id));
    }

    private TreatmentDto.Response toFullResponse(Treatment t) {
        return mapper.toResponse(t,
                sessionRepo.findByTreatment_IdOrderByCreatedAtAsc(t.getId()),
                serviceItemRepo.findByTreatment_Id(t.getId()));
    }
}

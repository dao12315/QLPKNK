package com.clinic.backend.core.service.impl;


import com.clinic.backend.core.domain.model.Appointment;
import com.clinic.backend.core.domain.model.Chair;
import com.clinic.backend.core.domain.model.Doctor;
import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.core.domain.repository.AppointmentRepository;
import com.clinic.backend.core.service.AppointmentService;
import com.clinic.backend.infrastructure.persistence.AppointmentSpecification;
import com.clinic.backend.web.dto.AppointmentDto;
import com.clinic.backend.web.mapper.AppointmentMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final AppointmentMapper mapper;

    // Cần các repository để load entity object từ UUID trong request
    private final com.clinic.backend.core.domain.repository.PatientRepository patientRepo;
    private final com.clinic.backend.core.domain.repository.DoctorRepository  doctorRepo;
//    private final com.clinic.backend.core.domain.repository.ChairRepository   chairRepo;

    // ─── UC09 – Tạo lịch hẹn ─────────────────────────────────
    @Override
    public AppointmentDto.Response create(AppointmentDto.CreateRequest req) {
        validateTimeRange(req.getStartTime(), req.getEndTime());

        // Load entity objects từ UUID – entity yêu cầu object reference, không phải UUID raw
        Patient patient = patientRepo.findById(req.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found: " + req.getPatientId()));
        Doctor doctor = doctorRepo.findById(req.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found: " + req.getDoctorId()));
//        Chair chair = null;
//        if (req.getChairId() != null) {
//            chair = chairRepo.findById(req.getChairId())
//                    .orElseThrow(() -> new EntityNotFoundException("Chair not found: " + req.getChairId()));
//        }

        checkConflict(req.getDoctorId(), req.getStartTime(), req.getEndTime(), null);

        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDoctor(doctor);
//        appt.setChair(chair);
        appt.setStartTime(req.getStartTime());
        appt.setEndTime(req.getEndTime());
        appt.setNote(req.getNote());
        appt.setReason(req.getReason());
        appt.setSymptoms(req.getSymptoms());
        appt.setPriority(req.getPriority() != null ? req.getPriority() : "normal");
        appt.setStatus("pending");
        appt.setCreatedAt(Instant.now());
        appt.setUpdatedAt(Instant.now());

        return mapper.toResponse(appointmentRepo.saveAndFlush(appt));
    }

    @Override
    public AppointmentDto.Response update(UUID id, AppointmentDto.UpdateRequest req) {
        Appointment appt = findOrThrow(id);
        Instant start = req.getStartTime() != null ? req.getStartTime() : appt.getStartTime();
        Instant end = req.getEndTime() != null ? req.getEndTime() : appt.getEndTime();
        validateTimeRange(start, end);
        checkConflict(appt.getDoctor().getId(), start, end, id);

        if (req.getPatientId() != null && !req.getPatientId().equals(appt.getPatient().getId())) {
            appt.setPatient(patientRepo.findById(req.getPatientId())
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found: " + req.getPatientId())));
        }
        if (req.getDoctorId() != null && !req.getDoctorId().equals(appt.getDoctor().getId())) {
            appt.setDoctor(doctorRepo.findById(req.getDoctorId())
                    .orElseThrow(() -> new EntityNotFoundException("Doctor not found: " + req.getDoctorId())));
        }
        appt.setStartTime(start);
        appt.setEndTime(end);
        if (req.getNote() != null) appt.setNote(req.getNote());
        if (req.getReason() != null) appt.setReason(req.getReason());
        if (req.getSymptoms() != null) appt.setSymptoms(req.getSymptoms());
        if (req.getPriority() != null) appt.setPriority(req.getPriority());
        appt.setUpdatedAt(Instant.now());
        return mapper.toResponse(appointmentRepo.saveAndFlush(appt));
    }

    // ─── UC10 – Xác nhận lịch hẹn ────────────────────────────
    @Override
    public AppointmentDto.Response confirm(UUID id) {
        Appointment appt = findOrThrow(id);
        if (!"pending".equals(appt.getStatus()))
            throw new IllegalStateException("Only pending appointments can be confirmed");
        appt.setStatus("confirmed");
        if (appt.getConfirmedAt() == null) appt.setConfirmedAt(Instant.now());
        appt.setUpdatedAt(Instant.now());
        return mapper.toResponse(appointmentRepo.saveAndFlush(appt));
    }

    // ─── UC11 – Hủy lịch hẹn ─────────────────────────────────
    @Override
    public AppointmentDto.Response cancel(UUID id, AppointmentDto.CancelRequest req) {
        Appointment appt = findOrThrow(id);
        if (List.of("done", "cancelled", "no_show").contains(appt.getStatus()))
            throw new IllegalStateException("Cannot cancel appointment with status: " + appt.getStatus());

        appt.setStatus("cancelled");
        String reason = req.getCancelReason() != null ? req.getCancelReason() : req.getCancellationReason();
        appt.setCancellationReason(reason);
        appt.setCancelReason(reason);
        appt.setUpdatedAt(Instant.now());
        return mapper.toResponse(appointmentRepo.saveAndFlush(appt));
    }

    // ─── UC11 – Dời lịch hẹn ─────────────────────────────────
    @Override
    public AppointmentDto.Response reschedule(UUID id, AppointmentDto.RescheduleRequest req) {
        Appointment original = findOrThrow(id);
        if (List.of("done", "cancelled", "no_show", "rescheduled").contains(original.getStatus()))
            throw new IllegalStateException("Cannot reschedule with status: " + original.getStatus());

        validateTimeRange(req.getNewStartTime(), req.getNewEndTime());
        checkConflict(original.getDoctor().getId(), req.getNewStartTime(), req.getNewEndTime(), id);

        // Đánh dấu lịch gốc là đã được dời
        original.setStatus("rescheduled");
        original.setUpdatedAt(Instant.now());
        appointmentRepo.saveAndFlush(original);

        // Tạo lịch mới – gán object reference của lịch gốc vào rescheduledFrom
        Appointment newAppt = new Appointment();
        newAppt.setPatient(original.getPatient());
        newAppt.setDoctor(original.getDoctor());
        newAppt.setStartTime(req.getNewStartTime());
        newAppt.setEndTime(req.getNewEndTime());
        newAppt.setNote(req.getNote());
        newAppt.setPriority("normal");
        newAppt.setStatus("pending");
        newAppt.setRescheduledFrom(original); // object reference, không phải UUID
        newAppt.setCreatedAt(Instant.now());
        newAppt.setUpdatedAt(Instant.now());

        return mapper.toResponse(appointmentRepo.saveAndFlush(newAppt));
    }

    // ─── UC12 – Xem lịch trong ngày ──────────────────────────
    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getForDay(UUID doctorId, LocalDate date) {
        // Chuyển LocalDate → Instant (UTC) để query với kiểu Instant trong entity
        Instant start = date.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant end   = date.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        List<Appointment> list = (doctorId != null)
                ? appointmentRepo.findByDoctorAndDay(doctorId, start, end)
                : appointmentRepo.findAllByDay(start, end);

        return mapper.toList(list);
    }

    // ─── Tìm kiếm phân trang ─────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public Page<AppointmentDto.Response> search(AppointmentDto.Filter filter) {
        String[] parts = filter.getSort().split(",");
        Sort sort = Sort.by(
                parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                        ? Sort.Direction.DESC : Sort.Direction.ASC,
                parts[0]
        );
        PageRequest pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        return appointmentRepo
                .findAll(AppointmentSpecification.of(filter), pageable)
                .map(mapper::toResponse);
    }

    // ─── Lấy theo ID ─────────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public AppointmentDto.Response getById(UUID id) {
        return mapper.toResponse(findOrThrow(id));
    }

    // ─── Helpers ─────────────────────────────────────────────
    private Appointment findOrThrow(UUID id) {
        return appointmentRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found: " + id));
    }

    private void validateTimeRange(Instant start, Instant end) {
        if (!end.isAfter(start))
            throw new IllegalArgumentException("End time must be after start time");
    }

    private void checkConflict(UUID doctorId, Instant start, Instant end, UUID excludeId) {
        UUID safeExclude = excludeId != null
                ? excludeId
                : UUID.fromString("00000000-0000-0000-0000-000000000000");
        if (appointmentRepo.hasConflict(doctorId, start, end, safeExclude))
            throw new IllegalStateException("Doctor has a conflicting appointment in this time slot");
    }
    // ─── Bác sĩ bắt đầu khám ────────────────────────────
    @Override
    public AppointmentDto.Response start(UUID id) {
        Appointment appt = findOrThrow(id);

        if (!List.of("confirmed", "checked_in").contains(appt.getStatus())) {
            throw new IllegalStateException("Only confirmed or checked_in appointments can be started");
        }

        appt.setStatus("in_progress");
        appt.setUpdatedAt(Instant.now());

        return mapper.toResponse(appointmentRepo.saveAndFlush(appt));
    }

    // ─── Bác sĩ hoàn thành khám ─────────────────────────
    @Override
    public AppointmentDto.Response complete(UUID id) {
        Appointment appt = findOrThrow(id);

        if (!"in_progress".equals(appt.getStatus())) {
            throw new IllegalStateException("Only in_progress appointments can be completed");
        }

        appt.setStatus("done");
        if (appt.getCompletedAt() == null) appt.setCompletedAt(Instant.now());
        appt.setUpdatedAt(Instant.now());

        return mapper.toResponse(appointmentRepo.saveAndFlush(appt));
    }

    @Override
    public AppointmentDto.Response checkIn(UUID id) {
        Appointment appt = findOrThrow(id);

        if (List.of("done", "cancelled", "no_show").contains(appt.getStatus())) {
            throw new IllegalStateException("Cannot check in appointment with status: " + appt.getStatus());
        }

        appt.setStatus("checked_in");
        if (appt.getCheckedInAt() == null) appt.setCheckedInAt(Instant.now());
        appt.setUpdatedAt(Instant.now());

        return mapper.toResponse(appointmentRepo.saveAndFlush(appt));
    }
}


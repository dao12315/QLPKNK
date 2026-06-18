package com.clinic.backend.core.service;


import com.clinic.backend.core.domain.model.Doctor;
import com.clinic.backend.core.domain.model.DoctorSchedule;
import com.clinic.backend.core.domain.repository.DoctorRepository;
import com.clinic.backend.core.domain.repository.ScheduleRepository;
import com.clinic.backend.web.dto.ScheduleDto;
import com.clinic.backend.web.mapper.ScheduleMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {

    private final ScheduleRepository repo;
    private final ScheduleMapper mapper;
    private final DoctorRepository doctorRepo;

    /** UC13 – Tạo ca làm việc */
    public ScheduleDto.Response create(ScheduleDto.CreateRequest req) {
        if (!req.getEndTime().isAfter(req.getStartTime()))
            throw new IllegalArgumentException("End time must be after start time");

        Doctor doctor = doctorRepo.findById(req.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found: " + req.getDoctorId()));

        DoctorSchedule schedule = new DoctorSchedule();
        schedule.setDoctor(doctor);           // gán object, không phải UUID
        schedule.setDayOfWeek(req.getDayOfWeek());
        schedule.setStartTime(req.getStartTime());
        schedule.setEndTime(req.getEndTime());
        schedule.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        schedule.setRoom(req.getRoom());
        schedule.setMaxPatients(req.getMaxPatients());
        schedule.setEffectiveFrom(req.getEffectiveFrom());
        schedule.setEffectiveTo(req.getEffectiveTo());

        return mapper.toResponse(repo.saveAndFlush(schedule));
    }

    /** UC13 – Cập nhật ca làm việc */
    public ScheduleDto.Response update(UUID id, ScheduleDto.@NonNull UpdateRequest req) {
        DoctorSchedule schedule = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found: " + id));
        if (req.getStartTime() != null) schedule.setStartTime(req.getStartTime());
        if (req.getEndTime()   != null) schedule.setEndTime(req.getEndTime());
        if (req.getIsActive()  != null) schedule.setIsActive(req.getIsActive());
        if (req.getRoom() != null) schedule.setRoom(req.getRoom());
        if (req.getMaxPatients() != null) schedule.setMaxPatients(req.getMaxPatients());
        if (req.getEffectiveFrom() != null) schedule.setEffectiveFrom(req.getEffectiveFrom());
        if (req.getEffectiveTo() != null) schedule.setEffectiveTo(req.getEffectiveTo());
        return mapper.toResponse(repo.saveAndFlush(schedule));
    }

    /** UC13 – Xóa ca làm việc */
    public void delete(UUID id) {
        if (!repo.existsById(id))
            throw new EntityNotFoundException("Schedule not found: " + id);
        repo.deleteById(id);
    }

    /** UC14 – Xem lịch bác sĩ */
    @Transactional(readOnly = true)
    public List<ScheduleDto.Response> getByDoctor(UUID doctorId, boolean activeOnly) {
        List<DoctorSchedule> list = activeOnly
                ? repo.findByDoctor_IdAndIsActiveTrue(doctorId)
                : repo.findByDoctor_IdOrderByDayOfWeekAsc(doctorId);
        return mapper.toList(list);
    }

    @Transactional(readOnly = true)
    public List<ScheduleDto.Response> getAll() {
        return mapper.toList(repo.findAll());
    }
}

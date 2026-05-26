package com.clinic.backend.core.domain.repository;


import com.clinic.backend.core.domain.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, UUID>,
        JpaSpecificationExecutor<Appointment> {

    // UC12 – Lịch hẹn của một bác sĩ trong khoảng thời gian (theo ngày)
    // Dùng a.doctor.id vì doctor là object, không phải UUID raw
    @Query("""
            SELECT a FROM Appointment a
            WHERE a.doctor.id = :doctorId
              AND a.startTime >= :dayStart
              AND a.startTime < :dayEnd
              AND a.status NOT IN ('cancelled', 'no_show', 'rescheduled')
            ORDER BY a.startTime ASC
            """)
    List<Appointment> findByDoctorAndDay(
            @Param("doctorId") UUID doctorId,
            @Param("dayStart") Instant dayStart,
            @Param("dayEnd") Instant dayEnd
    );

    // UC12 – Tất cả lịch hẹn trong một ngày (Receptionist view)
    @Query("""
            SELECT a FROM Appointment a
            WHERE a.startTime >= :dayStart
              AND a.startTime < :dayEnd
              AND a.status NOT IN ('cancelled', 'no_show', 'rescheduled')
            ORDER BY a.startTime ASC
            """)
    List<Appointment> findAllByDay(
            @Param("dayStart") Instant dayStart,
            @Param("dayEnd") Instant dayEnd
    );

    // Kiểm tra xung đột lịch của bác sĩ
    // a.rescheduledFrom là Appointment object nên không dùng được trực tiếp
    // Loại trừ bằng a.id <> :excludeId
    @Query("""
            SELECT COUNT(a) > 0 FROM Appointment a
            WHERE a.doctor.id = :doctorId
              AND a.id <> :excludeId
              AND a.status NOT IN ('cancelled', 'no_show', 'rescheduled')
              AND a.startTime < :endTime
              AND a.endTime > :startTime
            """)
    boolean hasConflict(
            @Param("doctorId") UUID doctorId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime,
            @Param("excludeId") UUID excludeId
    );
}


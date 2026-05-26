package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.domain.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduleRepository extends JpaRepository<DoctorSchedule, UUID> {

    // doctor là object → query bằng doctor.id
    List<DoctorSchedule> findByDoctor_IdOrderByDayOfWeekAsc(UUID doctorId);

    List<DoctorSchedule> findByDoctor_IdAndIsActiveTrue(UUID doctorId);
}

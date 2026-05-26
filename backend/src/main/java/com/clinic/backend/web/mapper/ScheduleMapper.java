package com.clinic.backend.web.mapper;


import com.clinic.backend.core.domain.model.Doctor;
import com.clinic.backend.core.domain.model.DoctorSchedule;
import com.clinic.backend.web.dto.ScheduleDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ScheduleMapper {

    private static final String[] DAY_NAMES =
            {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

    public ScheduleDto.Response toResponse(DoctorSchedule s) {
        Doctor doctor = s.getDoctor();
        return ScheduleDto.Response.builder()
                .id(s.getId())
                .doctorId(doctor != null ? doctor.getId() : null)
                .doctorName(doctor != null ? doctor.getFullName() : null)
                .dayOfWeek(s.getDayOfWeek())
                .dayName(s.getDayOfWeek() != null ? DAY_NAMES[s.getDayOfWeek()] : null)
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .isActive(s.getIsActive())
                .build();
    }

    public List<ScheduleDto.Response> toList(List<DoctorSchedule> list) {
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }
}

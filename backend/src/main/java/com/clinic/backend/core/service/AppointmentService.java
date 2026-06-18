package com.clinic.backend.core.service;


import com.clinic.backend.web.dto.AppointmentDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentService {

    // UC09 – Đặt lịch hẹn
    AppointmentDto.Response create(AppointmentDto.CreateRequest request);

    AppointmentDto.Response update(UUID id, AppointmentDto.UpdateRequest request);

    // UC10 – Xác nhận lịch hẹn
    AppointmentDto.Response confirm(UUID id);

    // UC11 – Hủy lịch hẹn
    AppointmentDto.Response cancel(UUID id, AppointmentDto.CancelRequest request);

    // UC11 – Dời lịch hẹn
    AppointmentDto.Response reschedule(UUID id, AppointmentDto.RescheduleRequest request);

    // UC12 – Xem lịch trong ngày
    List<AppointmentDto.Response> getForDay(UUID doctorId, LocalDate date);

    // Tìm kiếm phân trang
    Page<AppointmentDto.Response> search(AppointmentDto.Filter filter);

    // Lấy theo ID
    AppointmentDto.Response getById(UUID id);

    // Bác sĩ bắt đầu khám
    AppointmentDto.Response start(UUID id);

    // Bác sĩ hoàn thành khám
    AppointmentDto.Response complete(UUID id);

    AppointmentDto.Response checkIn(UUID id);

}

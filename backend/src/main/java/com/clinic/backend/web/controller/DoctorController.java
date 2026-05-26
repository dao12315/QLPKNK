package com.clinic.backend.web.controller;

import com.clinic.backend.core.common.base.BaseController;
import com.clinic.backend.core.service.DoctorService;
import com.clinic.backend.web.dto.CreateDoctorRequest;
import com.clinic.backend.web.dto.DoctorFilter;
import com.clinic.backend.web.dto.DoctorResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController extends BaseController<
        CreateDoctorRequest,
        DoctorResponse,
        DoctorFilter,
        UUID> {

    public DoctorController(DoctorService service) {
        super(service);
    }
}
package com.clinic.backend.web.controller;

import com.clinic.backend.core.common.base.BaseController;
import com.clinic.backend.web.dto.CreatePatientRequest;
import com.clinic.backend.web.dto.PatientFilter;
import com.clinic.backend.web.dto.PatientResponse;
import com.clinic.backend.core.service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
public class PatientController extends BaseController<
        CreatePatientRequest,
        PatientResponse,
        PatientFilter,
        UUID
        > {

    public PatientController(PatientService service) {
        super(service);
    }
}
package com.clinic.backend.infrastructure.persistence;


import com.clinic.backend.core.domain.model.Appointment;
import com.clinic.backend.web.dto.AppointmentDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AppointmentSpecification {

    public static Specification<Appointment> of(AppointmentDto.Filter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // root.get("doctor").get("id") vì doctor là object (@ManyToOne)
            // không thể dùng root.get("doctorId") vì field tên là "doctor"
            if (filter.getDoctorId() != null)
                predicates.add(cb.equal(root.get("doctor").get("id"), filter.getDoctorId()));

            if (filter.getPatientId() != null)
                predicates.add(cb.equal(root.get("patient").get("id"), filter.getPatientId()));


            if (filter.getStatus() != null && !filter.getStatus().isBlank())
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));

            if (filter.getDateFrom() != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("startTime"), filter.getDateFrom()));

            if (filter.getDateTo() != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("startTime"), filter.getDateTo()));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

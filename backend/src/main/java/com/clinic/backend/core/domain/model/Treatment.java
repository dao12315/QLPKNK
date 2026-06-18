package com.clinic.backend.core.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "treatments")
public class Treatment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("'planned'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "diagnosis", length = Integer.MAX_VALUE)
    private String diagnosis;

    @Column(name = "chief_complaint", length = Integer.MAX_VALUE)
    private String chiefComplaint;

    @Column(name = "clinical_examination", length = Integer.MAX_VALUE)
    private String clinicalExamination;

    @Column(name = "treatment_plan", length = Integer.MAX_VALUE)
    private String treatmentPlan;

    @Column(name = "note", length = Integer.MAX_VALUE)
    private String note;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "tooth_codes", columnDefinition = "text[]")
    private List<String> toothCodes;

    @Column(name = "tooth_note", length = Integer.MAX_VALUE)
    private String toothNote;

    @Column(name = "result_note", length = Integer.MAX_VALUE)
    private String resultNote;

    @Column(name = "doctor_note", length = Integer.MAX_VALUE)
    private String doctorNote;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;


}

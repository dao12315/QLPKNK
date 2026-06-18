package com.clinic.backend.core.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "patient_dental_info")
public class PatientDentalInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(name = "chief_complaint", length = Integer.MAX_VALUE)
    private String chiefComplaint;

    @Column(name = "dental_history", length = Integer.MAX_VALUE)
    private String dentalHistory;

    @Column(name = "tooth_pain_location", length = 100)
    private String toothPainLocation;

    @Min(0)
    @Max(10)
    @Column(name = "pain_level")
    private Integer painLevel;

    @ColumnDefault("false")
    @Column(name = "gum_bleeding")
    private Boolean gumBleeding;

    @ColumnDefault("false")
    @Column(name = "tooth_sensitivity")
    private Boolean toothSensitivity;

    @ColumnDefault("false")
    @Column(name = "bad_breath")
    private Boolean badBreath;

    @ColumnDefault("false")
    @Column(name = "cavities")
    private Boolean cavities;

    @Column(name = "brushing_frequency", length = 100)
    private String brushingFrequency;

    @Column(name = "flossing_habit", length = 100)
    private String flossingHabit;

    @Column(name = "dental_note", length = Integer.MAX_VALUE)
    private String dentalNote;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private Instant updatedAt;
}

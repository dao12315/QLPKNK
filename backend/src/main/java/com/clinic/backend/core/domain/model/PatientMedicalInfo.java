package com.clinic.backend.core.domain.model;

import jakarta.persistence.*;
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
@Table(name = "patient_medical_info")
public class PatientMedicalInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(name = "medical_history", length = Integer.MAX_VALUE)
    private String medicalHistory;

    @Column(name = "allergies", length = Integer.MAX_VALUE)
    private String allergies;

    @Column(name = "current_medications", length = Integer.MAX_VALUE)
    private String currentMedications;

    @Column(name = "chronic_diseases", length = Integer.MAX_VALUE)
    private String chronicDiseases;

    @Column(name = "past_surgeries", length = Integer.MAX_VALUE)
    private String pastSurgeries;

    @Column(name = "blood_pressure", length = 50)
    private String bloodPressure;

    @ColumnDefault("false")
    @Column(name = "heart_disease")
    private Boolean heartDisease;

    @ColumnDefault("false")
    @Column(name = "diabetes")
    private Boolean diabetes;

    @ColumnDefault("false")
    @Column(name = "hepatitis")
    private Boolean hepatitis;

    @ColumnDefault("false")
    @Column(name = "asthma")
    private Boolean asthma;

    @ColumnDefault("false")
    @Column(name = "is_pregnant")
    private Boolean isPregnant;

    @ColumnDefault("false")
    @Column(name = "is_breastfeeding")
    private Boolean isBreastfeeding;

    @Column(name = "medical_note", length = Integer.MAX_VALUE)
    private String medicalNote;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private Instant updatedAt;
}

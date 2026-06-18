package com.clinic.backend.web.dto;

import com.clinic.backend.core.common.base.BaseFilter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class TreatmentDto {

    @Data
    public static class CreateRequest {
        @NotNull private UUID patientId;
        private UUID doctorId;
        private UUID appointmentId;
        private String chiefComplaint;
        private String clinicalExamination;
        private String diagnosis;
        private String treatmentPlan;
        private String note;
        private String notes;
        private List<String> toothCodes;
        private String toothNote;
        private String resultNote;
        private String doctorNote;
        private LocalDate followUpDate;
    }

    @Data
    public static class UpdateRequest {
        private String status;
        private String chiefComplaint;
        private String clinicalExamination;
        private String diagnosis;
        private String treatmentPlan;
        private String note;
        private String notes;
        private List<String> toothCodes;
        private String toothNote;
        private String resultNote;
        private String doctorNote;
        private LocalDate followUpDate;
    }

    @Data
    public static class SessionRequest {
        @NotNull private UUID treatmentId;
        private UUID appointmentId;
        private String note;
        private Instant sessionDate;
        private String procedurePerformed;
        private String doctorNote;
        private String patientResponse;
        private LocalDate nextAppointmentDate;
    }

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SessionResponse {
        private UUID id;
        private UUID treatmentId;
        private UUID appointmentId;
        private String appointmentStatus;
        private String note;
        private Instant sessionDate;
        private String procedurePerformed;
        private String doctorNote;
        private String patientResponse;
        private LocalDate nextAppointmentDate;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    public static class ServiceItemRequest {
        @NotNull private UUID treatmentId;
        private UUID serviceId;
        @NotBlank private String serviceName;
        @Min(1) private Integer quantity = 1;
        @NotNull @DecimalMin("0") private BigDecimal unitPrice;
        private String toothCode;
        @DecimalMin("0") private BigDecimal discountAmount;
        @DecimalMin("0") private BigDecimal subtotal;
        private String note;
    }

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ServiceItemResponse {
        private UUID id;
        private UUID treatmentId;
        private UUID serviceId;
        private String serviceName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String toothCode;
        private BigDecimal discountAmount;
        private BigDecimal subtotal;
        private String note;
        private Instant createdAt;
        private BigDecimal total;
    }

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID patientId;
        private String patientName;
        private UUID doctorId;
        private String doctorName;
        private String status;
        private String chiefComplaint;
        private String clinicalExamination;
        private String diagnosis;
        private String treatmentPlan;
        private String note;
        private String notes;
        private List<String> toothCodes;
        private String toothNote;
        private String resultNote;
        private String doctorNote;
        private LocalDate followUpDate;
        private Instant startedAt;
        private Instant completedAt;
        private List<SessionResponse> sessions;
        private List<ServiceItemResponse> serviceItems;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    public static class Filter extends BaseFilter {
        private String sort = "createdAt,desc";
        private UUID patientId;
        private UUID doctorId;
        private String status;
    }
}

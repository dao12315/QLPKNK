package com.clinic.backend.core.service;

import com.clinic.backend.core.domain.model.Invoice;
import com.clinic.backend.core.domain.model.Patient;
import com.clinic.backend.core.domain.model.Payment;
import com.clinic.backend.core.domain.model.Treatment;
import com.clinic.backend.core.domain.repository.InvoiceRepository;
import com.clinic.backend.core.domain.repository.PatientRepository;
import com.clinic.backend.core.domain.repository.PaymentRepository;
import com.clinic.backend.core.domain.repository.PrescriptionItemRepository;
import com.clinic.backend.core.domain.repository.TreatmentRepository;
import com.clinic.backend.core.domain.repository.TreatmentServiceRepository;
import com.clinic.backend.web.dto.InvoiceDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepo;
    private final PaymentRepository paymentRepo;
    private final TreatmentRepository treatmentRepo;
    private final TreatmentServiceRepository treatmentServiceRepo;
    private final PrescriptionItemRepository prescriptionItemRepo;
    private final PatientRepository patientRepo;

    public InvoiceDto.Response create(InvoiceDto.CreateRequest req) {
        invoiceRepo.findByTreatment_Id(req.getTreatmentId()).ifPresent(inv -> {
            throw new IllegalStateException("Invoice already exists for treatment: " + inv.getId());
        });

        Treatment treatment = treatmentRepo.findById(req.getTreatmentId())
                .orElseThrow(() -> new EntityNotFoundException("Treatment not found: " + req.getTreatmentId()));
        Patient patient = patientRepo.findById(req.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found: " + req.getPatientId()));

        BigDecimal serviceAmount = calculateServiceAmount(req.getTreatmentId());
        BigDecimal medicineAmount = calculateMedicineAmount(req.getTreatmentId());
        BigDecimal total = serviceAmount.add(medicineAmount);

        Invoice invoice = new Invoice();
        invoice.setTreatment(treatment);
        invoice.setPatient(patient);
        invoice.setInvoiceCode(generateInvoiceCode());
        invoice.setTotalAmount(total);
        invoice.setDiscountAmount(defaultMoney(req.getDiscountAmount()));
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setStatus("unpaid");
        invoice.setNote(req.getNote());
        invoice.setCreatedAt(Instant.now());
        invoice.setUpdatedAt(Instant.now());
        recalculateStatus(invoice);

        return toResponse(invoiceRepo.saveAndFlush(invoice));
    }

    public InvoiceDto.Response update(UUID id, InvoiceDto.UpdateRequest req) {
        Invoice invoice = findOrThrow(id);
        assertNotCancelled(invoice);
        if (req.getNote() != null) invoice.setNote(req.getNote());
        if (req.getTotalAmount() != null) invoice.setTotalAmount(req.getTotalAmount());
        if (req.getDiscountAmount() != null) invoice.setDiscountAmount(req.getDiscountAmount());
        recalculateStatus(invoice);
        invoice.setUpdatedAt(Instant.now());
        return toResponse(invoiceRepo.saveAndFlush(invoice));
    }

    public InvoiceDto.Response cancel(UUID id) {
        return cancel(id, null);
    }

    public InvoiceDto.Response cancel(UUID id, InvoiceDto.UpdateRequest req) {
        Invoice invoice = findOrThrow(id);
        if ("paid".equals(invoice.getStatus())) {
            throw new IllegalStateException("Cannot cancel a fully paid invoice");
        }
        invoice.setStatus("cancelled");
        if (req != null) {
            invoice.setCancelReason(req.getCancelReason());
        }
        invoice.setUpdatedAt(Instant.now());
        return toResponse(invoiceRepo.saveAndFlush(invoice));
    }

    public InvoiceDto.Response recordPayment(UUID invoiceId, InvoiceDto.PaymentRequest req) {
        Invoice invoice = findOrThrow(invoiceId);
        assertNotCancelled(invoice);
        if ("paid".equals(invoice.getStatus())) {
            throw new IllegalStateException("Invoice is already fully paid");
        }

        BigDecimal remaining = effectiveFinalAmount(invoice).subtract(defaultMoney(invoice.getPaidAmount()));
        if (req.getAmount().compareTo(remaining) > 0) {
            throw new IllegalArgumentException("Payment exceeds remaining balance: " + remaining);
        }

        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setPaymentCode(generatePaymentCode());
        payment.setAmount(req.getAmount());
        payment.setMethod(req.getMethod());
        payment.setNote(req.getNote());
        payment.setTransactionCode(req.getTransactionCode());
        payment.setStatus(req.getStatus() != null ? req.getStatus() : "success");
        Instant now = Instant.now();
        payment.setPaidAt(now);
        payment.setCreatedAt(now);
        paymentRepo.saveAndFlush(payment);

        if ("success".equals(payment.getStatus())) {
            invoice.setPaidAmount(defaultMoney(invoice.getPaidAmount()).add(req.getAmount()));
        }
        recalculateStatus(invoice);
        invoice.setUpdatedAt(now);

        return toResponse(invoiceRepo.saveAndFlush(invoice));
    }

    @Transactional(readOnly = true)
    public List<InvoiceDto.PaymentResponse> getPayments(UUID invoiceId) {
        findOrThrow(invoiceId);
        return paymentRepo.findByInvoice_IdOrderByPaidAtDesc(invoiceId)
                .stream().map(this::toPaymentResponse).toList();
    }

    @Transactional(readOnly = true)
    public InvoiceDto.Response getById(UUID id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<InvoiceDto.Response> search(InvoiceDto.Filter filter) {
        String[] parts = filter.getSort().split(",");
        Sort sort = Sort.by(
                parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                        ? Sort.Direction.DESC : Sort.Direction.ASC,
                parts[0]
        );
        PageRequest pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Specification<Invoice> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.getPatientId() != null) {
                predicates.add(cb.equal(root.get("patient").get("id"), filter.getPatientId()));
            }
            if (filter.getTreatmentId() != null) {
                predicates.add(cb.equal(root.get("treatment").get("id"), filter.getTreatmentId()));
            }
            if (filter.getStatus() != null && !filter.getStatus().isBlank()) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.getDateFrom()));
            }
            if (filter.getDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.getDateTo()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return invoiceRepo.findAll(spec, pageable).map(this::toResponse);
    }

    private Invoice findOrThrow(UUID id) {
        return invoiceRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found: " + id));
    }

    private void assertNotCancelled(Invoice invoice) {
        if ("cancelled".equals(invoice.getStatus())) {
            throw new IllegalStateException("Invoice is cancelled");
        }
    }

    private void recalculateStatus(Invoice invoice) {
        BigDecimal finalAmount = invoice.getTotalAmount().subtract(defaultMoney(invoice.getDiscountAmount()));
        invoice.setFinalAmount(finalAmount);
        invoice.setPaidAmount(defaultMoney(invoice.getPaidAmount()));
        invoice.setRemainingAmount(finalAmount.subtract(invoice.getPaidAmount()));
        if ("cancelled".equals(invoice.getStatus())) {
            return;
        }
        int cmp = invoice.getPaidAmount().compareTo(finalAmount);
        if (cmp >= 0) {
            invoice.setStatus("paid");
        } else if (invoice.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            invoice.setStatus("partial");
        } else {
            invoice.setStatus("unpaid");
        }
    }

    private InvoiceDto.Response toResponse(Invoice inv) {
        List<Payment> payments = paymentRepo.findByInvoice_IdOrderByPaidAtDesc(inv.getId());
        Patient patient = inv.getPatient();
        Treatment treatment = inv.getTreatment();

        return InvoiceDto.Response.builder()
                .id(inv.getId())
                .treatmentId(treatment != null ? treatment.getId() : null)
                .patientId(patient != null ? patient.getId() : null)
                .patientName(patient != null ? patient.getFullName() : null)
                .invoiceCode(inv.getInvoiceCode())
                .serviceAmount(calculateServiceAmount(treatment != null ? treatment.getId() : null))
                .medicineAmount(calculateMedicineAmount(treatment != null ? treatment.getId() : null))
                .totalAmount(inv.getTotalAmount())
                .discountAmount(defaultMoney(inv.getDiscountAmount()))
                .finalAmount(effectiveFinalAmount(inv))
                .paidAmount(defaultMoney(inv.getPaidAmount()))
                .remainingAmount(effectiveFinalAmount(inv).subtract(defaultMoney(inv.getPaidAmount())))
                .issuedBy(inv.getIssuedBy() != null ? inv.getIssuedBy().getId() : null)
                .status(inv.getStatus())
                .note(inv.getNote())
                .cancelReason(inv.getCancelReason())
                .payments(payments.stream().map(this::toPaymentResponse).collect(Collectors.toList()))
                .createdAt(inv.getCreatedAt())
                .updatedAt(inv.getUpdatedAt())
                .build();
    }

    private InvoiceDto.PaymentResponse toPaymentResponse(Payment p) {
        return InvoiceDto.PaymentResponse.builder()
                .id(p.getId())
                .invoiceId(p.getInvoice().getId())
                .paymentCode(p.getPaymentCode())
                .amount(p.getAmount())
                .method(p.getMethod())
                .note(p.getNote())
                .transactionCode(p.getTransactionCode())
                .receivedBy(p.getReceivedBy() != null ? p.getReceivedBy().getId() : null)
                .status(p.getStatus())
                .paidAt(p.getPaidAt())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private BigDecimal defaultMoney(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private BigDecimal calculateServiceAmount(UUID treatmentId) {
        if (treatmentId == null) {
            return BigDecimal.ZERO;
        }
        return treatmentServiceRepo.findByTreatment_Id(treatmentId)
                .stream()
                .map(ts -> {
                    if (ts.getSubtotal() != null) {
                        return ts.getSubtotal();
                    }
                    BigDecimal gross = defaultMoney(ts.getUnitPrice())
                            .multiply(BigDecimal.valueOf(ts.getQuantity() != null ? ts.getQuantity() : 0));
                    return gross.subtract(defaultMoney(ts.getDiscountAmount()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateMedicineAmount(UUID treatmentId) {
        if (treatmentId == null) {
            return BigDecimal.ZERO;
        }
        return prescriptionItemRepo.findByPrescription_Treatment_Id(treatmentId)
                .stream()
                .map(item -> {
                    BigDecimal price = item.getMedicine() != null
                            ? defaultMoney(item.getMedicine().getPrice())
                            : BigDecimal.ZERO;
                    return price.multiply(BigDecimal.valueOf(item.getQuantity() != null ? item.getQuantity() : 0));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal effectiveFinalAmount(Invoice invoice) {
        return invoice.getFinalAmount() != null
                ? invoice.getFinalAmount()
                : invoice.getTotalAmount().subtract(defaultMoney(invoice.getDiscountAmount()));
    }

    private String generateInvoiceCode() {
        return "HD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
    }

    private String generatePaymentCode() {
        return "TT" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
    }
}

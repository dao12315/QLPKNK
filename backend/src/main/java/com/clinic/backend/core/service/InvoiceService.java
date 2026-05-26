package com.clinic.backend.core.service;


import com.clinic.backend.core.domain.model.*;
import com.clinic.backend.core.domain.repository.*;
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
    private final PatientRepository         patientRepo;

    // ─── UC22 – Lập hóa đơn ──────────────────────────────────
    public InvoiceDto.Response create(InvoiceDto.CreateRequest req) {
        // Kiểm tra trùng lặp – UNIQUE constraint treatment_id
        invoiceRepo.findByTreatment_Id(req.getTreatmentId()).ifPresent(inv -> {
            throw new IllegalStateException("Invoice already exists for treatment: " + inv.getId());
        });

        Treatment treatment = treatmentRepo.findById(req.getTreatmentId())
                .orElseThrow(() -> new EntityNotFoundException("Treatment not found: " + req.getTreatmentId()));
        Patient patient = patientRepo.findById(req.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found: " + req.getPatientId()));

        // Tự tính tổng tiền nếu không truyền vào
        BigDecimal total = req.getTotalAmount();
        if (total == null) {
            total = treatmentServiceRepo.findByTreatment_Id(req.getTreatmentId())
                    .stream()
                    .map(ts -> ts.getUnitPrice().multiply(BigDecimal.valueOf(ts.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        Invoice invoice = new Invoice();
        invoice.setTreatment(treatment);    // OneToOne object reference
        invoice.setPatient(patient);        // ManyToOne object reference
        invoice.setTotalAmount(total);
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setStatus("unpaid");
        invoice.setNote(req.getNote());
        invoice.setCreatedAt(Instant.now());
        invoice.setUpdatedAt(Instant.now());

        return toResponse(invoiceRepo.saveAndFlush(invoice));
    }

    // ─── UC22 – Cập nhật hóa đơn ─────────────────────────────
    public InvoiceDto.Response update(UUID id, InvoiceDto.UpdateRequest req) {
        Invoice invoice = findOrThrow(id);
        assertNotCancelled(invoice);
        if (req.getNote()        != null) invoice.setNote(req.getNote());
        if (req.getTotalAmount() != null) invoice.setTotalAmount(req.getTotalAmount());
        recalculateStatus(invoice);
        invoice.setUpdatedAt(Instant.now());
        return toResponse(invoiceRepo.saveAndFlush(invoice));
    }

    // ─── UC22 – Hủy hóa đơn ──────────────────────────────────
    public InvoiceDto.Response cancel(UUID id) {
        Invoice invoice = findOrThrow(id);
        if ("paid".equals(invoice.getStatus()))
            throw new IllegalStateException("Cannot cancel a fully paid invoice");
        invoice.setStatus("cancelled");
        invoice.setUpdatedAt(Instant.now());
        return toResponse(invoiceRepo.saveAndFlush(invoice));
    }

    // ─── UC23 – Ghi nhận thanh toán ──────────────────────────
    public InvoiceDto.Response recordPayment(UUID invoiceId, InvoiceDto.PaymentRequest req) {
        Invoice invoice = findOrThrow(invoiceId);
        assertNotCancelled(invoice);
        if ("paid".equals(invoice.getStatus()))
            throw new IllegalStateException("Invoice is already fully paid");

        BigDecimal remaining = invoice.getTotalAmount().subtract(invoice.getPaidAmount());
        if (req.getAmount().compareTo(remaining) > 0)
            throw new IllegalArgumentException("Payment exceeds remaining balance: " + remaining);

        // Payment.invoice là ManyToOne object reference
        Payment payment = new Payment();
        payment.setInvoice(invoice);    // object reference
        payment.setAmount(req.getAmount());
        payment.setMethod(req.getMethod());
        payment.setNote(req.getNote());
        payment.setPaidAt(Instant.now());
        paymentRepo.saveAndFlush(payment);

        invoice.setPaidAmount(invoice.getPaidAmount().add(req.getAmount()));
        recalculateStatus(invoice);
        invoice.setUpdatedAt(Instant.now());

        return toResponse(invoiceRepo.saveAndFlush(invoice));
    }

    // ─── UC23 – Lịch sử thanh toán ───────────────────────────
    @Transactional(readOnly = true)
    public List<InvoiceDto.PaymentResponse> getPayments(UUID invoiceId) {
        findOrThrow(invoiceId);
        return paymentRepo.findByInvoice_IdOrderByPaidAtDesc(invoiceId)
                .stream().map(this::toPaymentResponse).toList();
    }

    // ─── UC24 – Xem chi tiết hóa đơn ─────────────────────────
    @Transactional(readOnly = true)
    public InvoiceDto.Response getById(UUID id) {
        return toResponse(findOrThrow(id));
    }

    // ─── UC24 – Tìm kiếm hóa đơn ─────────────────────────────
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
            // patient là ManyToOne object
            if (filter.getPatientId() != null)
                predicates.add(cb.equal(root.get("patient").get("id"), filter.getPatientId()));
            if (filter.getStatus() != null && !filter.getStatus().isBlank())
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            if (filter.getDateFrom() != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.getDateFrom()));
            if (filter.getDateTo() != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.getDateTo()));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return invoiceRepo.findAll(spec, pageable).map(this::toResponse);
    }

    // ─── Helpers ─────────────────────────────────────────────
    private Invoice findOrThrow(UUID id) {
        return invoiceRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found: " + id));
    }

    private void assertNotCancelled(Invoice invoice) {
        if ("cancelled".equals(invoice.getStatus()))
            throw new IllegalStateException("Invoice is cancelled");
    }

    private void recalculateStatus(Invoice invoice) {
        int cmp = invoice.getPaidAmount().compareTo(invoice.getTotalAmount());
        if (cmp >= 0)
            invoice.setStatus("paid");
        else if (invoice.getPaidAmount().compareTo(BigDecimal.ZERO) > 0)
            invoice.setStatus("partial");
        else
            invoice.setStatus("unpaid");
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
                .totalAmount(inv.getTotalAmount())
                .paidAmount(inv.getPaidAmount())
                .remainingAmount(inv.getTotalAmount().subtract(inv.getPaidAmount()))
                .status(inv.getStatus())
                .note(inv.getNote())
                .payments(payments.stream().map(this::toPaymentResponse).collect(Collectors.toList()))
                .createdAt(inv.getCreatedAt())
                .updatedAt(inv.getUpdatedAt())
                .build();
    }

    private InvoiceDto.PaymentResponse toPaymentResponse(Payment p) {
        return InvoiceDto.PaymentResponse.builder()
                .id(p.getId())
                .invoiceId(p.getInvoice().getId())  // invoice là object → lấy id
                .amount(p.getAmount())
                .method(p.getMethod())
                .note(p.getNote())
                .paidAt(p.getPaidAt())
                .build();
    }
}
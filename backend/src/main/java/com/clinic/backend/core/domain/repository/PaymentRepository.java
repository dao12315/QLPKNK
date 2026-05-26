package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.domain.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    // invoice là ManyToOne object → query bằng invoice.id
    List<Payment> findByInvoice_IdOrderByPaidAtDesc(UUID invoiceId);
}

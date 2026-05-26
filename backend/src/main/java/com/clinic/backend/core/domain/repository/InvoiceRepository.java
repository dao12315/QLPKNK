package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.domain.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository
        extends JpaRepository<Invoice, UUID>, JpaSpecificationExecutor<Invoice> {

    // treatment là OneToOne object → query bằng treatment.id
    Optional<Invoice> findByTreatment_Id(UUID treatmentId);

    // UC25 – Tổng doanh thu theo khoảng thời gian
    @Query("""
            SELECT COALESCE(SUM(p.amount), 0)
            FROM Payment p
            JOIN p.invoice i
            WHERE p.paidAt BETWEEN :from AND :to
            """)
    BigDecimal sumRevenueBetween(@Param("from") Instant from, @Param("to") Instant to);
}

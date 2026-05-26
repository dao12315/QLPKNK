package com.clinic.backend.core.domain.repository;

import com.clinic.backend.core.domain.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface MedicineRepository
        extends JpaRepository<Medicine, UUID>, JpaSpecificationExecutor<Medicine> {

    // UC21 – Thuốc tồn kho thấp
    @Query("SELECT m FROM Medicine m WHERE m.stock < :threshold ORDER BY m.stock ASC")
    List<Medicine> findLowStock(@Param("threshold") int threshold);

    // UC21 – Thuốc sắp hết hạn
    @Query("SELECT m FROM Medicine m WHERE m.expiryDate BETWEEN :today AND :deadline ORDER BY m.expiryDate ASC")
    List<Medicine> findExpiringSoon(@Param("today") LocalDate today, @Param("deadline") LocalDate deadline);
}

-- =====================================================
-- V6: MIGRATE SYSTEM FROM SERIAL -> UUID (SAFE VERSION)
-- =====================================================

-- ================= EXTENSIONS =================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- =====================================================
-- 1. USERS (ROOT ENTITY FIRST)
-- =====================================================
ALTER TABLE users ADD COLUMN uuid_id UUID DEFAULT gen_random_uuid();

UPDATE users
SET uuid_id = gen_random_uuid()
WHERE uuid_id IS NULL;

ALTER TABLE users ALTER COLUMN uuid_id SET NOT NULL;

CREATE UNIQUE INDEX idx_users_uuid ON users(uuid_id);

-- =====================================================
-- 2. PATIENTS
-- =====================================================
ALTER TABLE patients ADD COLUMN user_uuid UUID;

UPDATE patients p
SET user_uuid = u.uuid_id
    FROM users u
WHERE p.user_id = u.id;

-- =====================================================
-- 3. DOCTORS
-- =====================================================
ALTER TABLE doctors ADD COLUMN user_uuid UUID;

UPDATE doctors d
SET user_uuid = u.uuid_id
    FROM users u
WHERE d.user_id = u.id;

-- =====================================================
-- 4. REFRESH TOKENS
-- =====================================================
ALTER TABLE refresh_tokens ADD COLUMN user_uuid UUID;

UPDATE refresh_tokens r
SET user_uuid = u.uuid_id
    FROM users u
WHERE r.user_id = u.id;

-- =====================================================
-- 5. APPOINTMENTS
-- =====================================================
ALTER TABLE appointments ADD COLUMN patient_uuid UUID;
ALTER TABLE appointments ADD COLUMN doctor_uuid UUID;

UPDATE appointments a
SET patient_uuid = p.user_uuid
    FROM patients p
WHERE a.patient_id = p.id;

UPDATE appointments a
SET doctor_uuid = d.user_uuid
    FROM doctors d
WHERE a.doctor_id = d.id;

-- =====================================================
-- 6. TREATMENTS
-- =====================================================
ALTER TABLE treatments ADD COLUMN patient_uuid UUID;
ALTER TABLE treatments ADD COLUMN doctor_uuid UUID;

UPDATE treatments t
SET patient_uuid = p.user_uuid
    FROM patients p
WHERE t.patient_id = p.id;

UPDATE treatments t
SET doctor_uuid = d.user_uuid
    FROM doctors d
WHERE t.doctor_id = d.id;

-- =====================================================
-- 7. INVOICES
-- =====================================================
ALTER TABLE invoices ADD COLUMN patient_uuid UUID;

UPDATE invoices i
SET patient_uuid = p.user_uuid
    FROM patients p
WHERE i.patient_id = p.id;

-- =====================================================
-- 8. PAYMENTS
-- =====================================================
ALTER TABLE payments ADD COLUMN invoice_uuid INT;

UPDATE payments pay
SET invoice_uuid = pay.invoice_id;

-- =====================================================
-- 9. DROP FK CONSTRAINTS SAFELY
-- =====================================================
ALTER TABLE patients DROP CONSTRAINT IF EXISTS patients_user_id_fkey;
ALTER TABLE doctors DROP CONSTRAINT IF EXISTS doctors_user_id_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_patient_id_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_doctor_id_fkey;
ALTER TABLE treatments DROP CONSTRAINT IF EXISTS treatments_patient_id_fkey;
ALTER TABLE treatments DROP CONSTRAINT IF EXISTS treatments_doctor_id_fkey;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_patient_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_invoice_id_fkey;
ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;

-- =====================================================
-- 10. SWITCH USERS PK (LAST SAFE STEP)
-- =====================================================
ALTER TABLE users DROP CONSTRAINT users_pkey;
ALTER TABLE users DROP COLUMN id;
ALTER TABLE users RENAME COLUMN uuid_id TO id;
ALTER TABLE users ADD PRIMARY KEY (id);

-- =====================================================
-- 11. REPLACE FK COLUMNS (PATIENTS / DOCTORS)
-- =====================================================
ALTER TABLE patients DROP COLUMN user_id;
ALTER TABLE patients RENAME COLUMN user_uuid TO user_id;

ALTER TABLE doctors DROP COLUMN user_id;
ALTER TABLE doctors RENAME COLUMN user_uuid TO user_id;

ALTER TABLE refresh_tokens DROP COLUMN user_id;
ALTER TABLE refresh_tokens RENAME COLUMN user_uuid TO user_id;

-- =====================================================
-- 12. APPOINTMENTS SWITCH
-- =====================================================
ALTER TABLE appointments DROP COLUMN patient_id;
ALTER TABLE appointments DROP COLUMN doctor_id;

ALTER TABLE appointments RENAME COLUMN patient_uuid TO patient_id;
ALTER TABLE appointments RENAME COLUMN doctor_uuid TO doctor_id;

-- =====================================================
-- 13. TREATMENTS SWITCH
-- =====================================================
ALTER TABLE treatments DROP COLUMN patient_id;
ALTER TABLE treatments DROP COLUMN doctor_id;

ALTER TABLE treatments RENAME COLUMN patient_uuid TO patient_id;
ALTER TABLE treatments RENAME COLUMN doctor_uuid TO doctor_id;

-- =====================================================
-- 14. INVOICES SWITCH
-- =====================================================
ALTER TABLE invoices DROP COLUMN patient_id;
ALTER TABLE invoices RENAME COLUMN patient_uuid TO patient_id;

-- =====================================================
-- 15. PAYMENTS SWITCH
-- =====================================================
ALTER TABLE payments DROP COLUMN invoice_id;
ALTER TABLE payments RENAME COLUMN invoice_uuid TO invoice_id;

-- =====================================================
-- 16. RECREATE INDEXES
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_patients_phone ON patients(phone);

CREATE INDEX idx_appointments_time ON appointments(start_time);
CREATE INDEX idx_appointments_doctor_time ON appointments(doctor_id, start_time);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);

CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);

CREATE INDEX idx_treatments_patient ON treatments(patient_id);
CREATE INDEX idx_treatments_doctor ON treatments(doctor_id);
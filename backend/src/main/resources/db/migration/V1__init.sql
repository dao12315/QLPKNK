-- =========================================================
-- EXTENSIONS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- =========================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                       name VARCHAR(100) NOT NULL,

                       email VARCHAR(100) UNIQUE NOT NULL,

                       password TEXT NOT NULL,

                       role VARCHAR(20) NOT NULL
                           CHECK (role IN (
                                           'admin',
                                           'receptionist',
                                           'dentist',
                                           'patient'
                               )),

                       status VARCHAR(20) NOT NULL DEFAULT 'active'
                           CHECK (status IN (
                                             'active',
                                             'inactive',
                                             'suspended'
                               )),

                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- PATIENTS
-- =========================================================
CREATE TABLE patients (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                          user_id UUID REFERENCES users(id) ON DELETE SET NULL,

                          full_name VARCHAR(100) NOT NULL,

                          phone VARCHAR(20) NOT NULL,

                          gender VARCHAR(10)
                              CHECK (gender IN (
                                                'male',
                                                'female',
                                                'other'
                                  )),

                          date_of_birth DATE,

                          address TEXT,

                          medical_history TEXT,

                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_user_id
    ON patients(user_id);

CREATE INDEX idx_patients_phone
    ON patients(phone);

CREATE TRIGGER trg_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- DOCTORS
-- =========================================================
CREATE TABLE doctors (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                         user_id UUID UNIQUE NOT NULL
                             REFERENCES users(id) ON DELETE CASCADE,

                         full_name VARCHAR(100) NOT NULL,

                         specialization VARCHAR(100),

                         experience_years INTEGER,

                         phone VARCHAR(20),

                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_doctors_user_id ON doctors(user_id);

CREATE TRIGGER trg_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- DOCTOR SCHEDULES
-- =========================================================
CREATE TABLE doctor_schedules (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                  doctor_id UUID NOT NULL
                                      REFERENCES doctors(id) ON DELETE CASCADE,

                                  day_of_week SMALLINT NOT NULL
                                      CHECK (day_of_week BETWEEN 0 AND 6),

                                  start_time TIME NOT NULL,

                                  end_time TIME NOT NULL,

                                  is_active BOOLEAN NOT NULL DEFAULT TRUE,

                                  CHECK (start_time < end_time)
);

CREATE INDEX idx_doctor_schedules_doctor
    ON doctor_schedules(doctor_id, day_of_week);

-- =========================================================
-- CHAIRS
-- =========================================================
CREATE TABLE chairs (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                        name VARCHAR(50) NOT NULL,

                        status VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN (
                                              'active',
                                              'inactive',
                                              'maintenance'
                                )),

                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- APPOINTMENTS
-- =========================================================
CREATE TABLE appointments (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                              patient_id UUID NOT NULL
                                  REFERENCES patients(id),

                              doctor_id UUID NOT NULL
                                  REFERENCES doctors(id),

                              chair_id UUID
                                  REFERENCES chairs(id),

                              start_time TIMESTAMP NOT NULL,

                              end_time TIMESTAMP NOT NULL,

                              status VARCHAR(20) NOT NULL DEFAULT 'pending'
                                  CHECK (status IN (
                                                    'pending',
                                                    'confirmed',
                                                    'in_progress',
                                                    'done',
                                                    'cancelled',
                                                    'no_show',
                                                    'rescheduled'
                                      )),

                              note TEXT,

                              cancellation_reason TEXT,

                              rescheduled_from UUID
                                  REFERENCES appointments(id),

                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CHECK (start_time < end_time)
);

CREATE INDEX idx_appointments_patient
    ON appointments(patient_id);

CREATE INDEX idx_appointments_patient_time
    ON appointments(patient_id, start_time DESC);

CREATE INDEX idx_appointments_doctor_time
    ON appointments(doctor_id, start_time);

CREATE INDEX idx_appointments_status
    ON appointments(status);

ALTER TABLE appointments
    ADD CONSTRAINT appointments_chair_no_overlap
    EXCLUDE USING gist (
    chair_id WITH =,
    tsrange(start_time, end_time) WITH &&
)
WHERE (
    chair_id IS NOT NULL
    AND status NOT IN (
        'cancelled',
        'no_show',
        'rescheduled'
    )
);

ALTER TABLE appointments
    ADD CONSTRAINT appointments_doctor_no_overlap
    EXCLUDE USING gist (
    doctor_id WITH =,
    tsrange(start_time, end_time) WITH &&
)
WHERE (
    status NOT IN (
        'cancelled',
        'no_show',
        'rescheduled'
    )
);

CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- SERVICES
-- =========================================================
CREATE TABLE services (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                          name VARCHAR(100) NOT NULL,

                          description TEXT,

                          price NUMERIC(10,2) NOT NULL DEFAULT 0
                              CHECK (price >= 0),

                          duration_minutes INTEGER,

                          is_active BOOLEAN NOT NULL DEFAULT TRUE,

                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- TREATMENTS
-- =========================================================
CREATE TABLE treatments (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                            patient_id UUID NOT NULL
                                REFERENCES patients(id),

                            doctor_id UUID NOT NULL
                                REFERENCES doctors(id),

                            status VARCHAR(20) NOT NULL DEFAULT 'planned'
                                CHECK (status IN (
                                                  'planned',
                                                  'in_progress',
                                                  'completed',
                                                  'cancelled'
                                    )),

                            diagnosis TEXT,

                            note TEXT,

                            tooth_codes TEXT[],

                            tooth_note TEXT,

                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_treatments_patient
    ON treatments(patient_id);

CREATE INDEX idx_treatments_doctor
    ON treatments(doctor_id);

CREATE INDEX idx_treatments_status
    ON treatments(status);

CREATE INDEX idx_treatments_tooth_codes
    ON treatments USING GIN(tooth_codes);

CREATE TRIGGER trg_treatments_updated_at
    BEFORE UPDATE ON treatments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- TREATMENT SESSIONS
-- =========================================================
CREATE TABLE treatment_sessions (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                    treatment_id UUID NOT NULL
                                        REFERENCES treatments(id) ON DELETE CASCADE,

                                    appointment_id UUID
                                        REFERENCES appointments(id),

                                    note TEXT,

                                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_treatment_sessions_treatment
    ON treatment_sessions(treatment_id);

CREATE INDEX idx_treatment_sessions_appt
    ON treatment_sessions(appointment_id);

-- =========================================================
-- TREATMENT SERVICES
-- =========================================================
CREATE TABLE treatment_services (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                    treatment_id UUID NOT NULL
                                        REFERENCES treatments(id) ON DELETE CASCADE,

                                    service_id UUID
                                        REFERENCES services(id),

                                    service_name VARCHAR(100) NOT NULL,

                                    quantity INTEGER NOT NULL DEFAULT 1
                                        CHECK (quantity > 0),

                                    unit_price NUMERIC(10,2) NOT NULL
                                        CHECK (unit_price >= 0)
);

CREATE INDEX idx_treatment_services_treatment
    ON treatment_services(treatment_id);

-- =========================================================
-- MEDICINES
-- =========================================================
CREATE TABLE medicines (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                           name VARCHAR(100) NOT NULL,

                           unit VARCHAR(20),

                           price NUMERIC(10,2) NOT NULL DEFAULT 0
                               CHECK (price >= 0),

                           stock INTEGER NOT NULL DEFAULT 0
                               CHECK (stock >= 0),

                           batch_number VARCHAR(50),

                           expiry_date DATE,

                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_medicines_updated_at
    BEFORE UPDATE ON medicines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- PRESCRIPTIONS
-- =========================================================
CREATE TABLE prescriptions (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                               treatment_id UUID NOT NULL
                                   REFERENCES treatments(id) ON DELETE CASCADE,

                               note TEXT,

                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescriptions_treatment
    ON prescriptions(treatment_id);

-- =========================================================
-- PRESCRIPTION ITEMS
-- =========================================================
CREATE TABLE prescription_items (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                    prescription_id UUID NOT NULL
                                        REFERENCES prescriptions(id) ON DELETE CASCADE,

                                    medicine_id UUID NOT NULL
                                        REFERENCES medicines(id),

                                    quantity INTEGER NOT NULL
                                        CHECK (quantity > 0),

                                    dosage TEXT
);

CREATE INDEX idx_prescription_items_presc
    ON prescription_items(prescription_id);

-- =========================================================
-- INVOICES
-- =========================================================
CREATE TABLE invoices (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                          treatment_id UUID UNIQUE NOT NULL
                              REFERENCES treatments(id),

                          patient_id UUID NOT NULL
                              REFERENCES patients(id),

                          total_amount NUMERIC(10,2) NOT NULL DEFAULT 0
                              CHECK (total_amount >= 0),

                          paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0
                              CHECK (paid_amount >= 0),

                          status VARCHAR(20) NOT NULL DEFAULT 'unpaid'
                              CHECK (status IN (
                                                'unpaid',
                                                'partial',
                                                'paid',
                                                'cancelled'
                                  )),

                          note TEXT,

                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CHECK (paid_amount <= total_amount)
);

CREATE INDEX idx_invoices_patient
    ON invoices(patient_id);

CREATE INDEX idx_invoices_status
    ON invoices(status);

CREATE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- PAYMENTS
-- =========================================================
CREATE TABLE payments (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                          invoice_id UUID NOT NULL
                              REFERENCES invoices(id),

                          amount NUMERIC(10,2) NOT NULL
                              CHECK (amount > 0),

                          method VARCHAR(20) NOT NULL
                              CHECK (method IN (
                                                'cash',
                                                'banking',
                                                'momo',
                                                'vnpay',
                                                'other'
                                  )),

                          note TEXT,

                          paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_invoice
    ON payments(invoice_id);

-- =========================================================
-- REFRESH TOKENS
-- =========================================================
CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                user_id UUID NOT NULL
                                    REFERENCES users(id) ON DELETE CASCADE,

                                token TEXT UNIQUE NOT NULL,

                                expiry_date TIMESTAMP NOT NULL,

                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user
    ON refresh_tokens(user_id);

CREATE INDEX idx_refresh_tokens_expiry
    ON refresh_tokens(expiry_date);
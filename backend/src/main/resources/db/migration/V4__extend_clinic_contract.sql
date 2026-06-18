-- Patients
ALTER TABLE patients ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS identity_number VARCHAR(30);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS occupation VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact_relationship VARCHAR(50);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS note TEXT;

DO $$
DECLARE constraint_name text;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'patients'::regclass
      AND pg_get_constraintdef(oid) LIKE '%status%CHECK%';
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE patients DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

ALTER TABLE patients DROP CONSTRAINT IF EXISTS patients_status_check;
ALTER TABLE patients
    ADD CONSTRAINT patients_status_check CHECK (status IN ('active', 'inactive'));

CREATE TABLE IF NOT EXISTS patient_medical_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    chronic_diseases TEXT,
    past_surgeries TEXT,
    blood_pressure VARCHAR(50),
    heart_disease BOOLEAN DEFAULT FALSE,
    diabetes BOOLEAN DEFAULT FALSE,
    hepatitis BOOLEAN DEFAULT FALSE,
    asthma BOOLEAN DEFAULT FALSE,
    is_pregnant BOOLEAN DEFAULT FALSE,
    is_breastfeeding BOOLEAN DEFAULT FALSE,
    medical_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_patient_medical_info_updated_at
    BEFORE UPDATE ON patient_medical_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS patient_dental_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
    chief_complaint TEXT,
    dental_history TEXT,
    tooth_pain_location VARCHAR(100),
    pain_level INTEGER CHECK (pain_level BETWEEN 0 AND 10),
    gum_bleeding BOOLEAN DEFAULT FALSE,
    tooth_sensitivity BOOLEAN DEFAULT FALSE,
    bad_breath BOOLEAN DEFAULT FALSE,
    cavities BOOLEAN DEFAULT FALSE,
    brushing_frequency VARCHAR(100),
    flossing_habit VARCHAR(100),
    dental_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_patient_dental_info_updated_at
    BEFORE UPDATE ON patient_dental_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS symptoms TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

DO $$
DECLARE constraint_name text;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'appointments'::regclass
      AND pg_get_constraintdef(oid) LIKE '%status%CHECK%';
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE appointments DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments
    ADD CONSTRAINT appointments_status_check CHECK (status IN (
        'pending', 'confirmed', 'checked_in', 'in_progress', 'done', 'cancelled', 'no_show', 'rescheduled'
    ));

ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_priority_check;
ALTER TABLE appointments
    ADD CONSTRAINT appointments_priority_check CHECK (priority IN ('normal', 'high', 'urgent'));

-- Treatments
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS chief_complaint TEXT;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS clinical_examination TEXT;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS treatment_plan TEXT;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS result_note TEXT;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS doctor_note TEXT;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS follow_up_date DATE;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS started_at TIMESTAMP;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Treatment sessions
ALTER TABLE treatment_sessions ADD COLUMN IF NOT EXISTS session_date TIMESTAMP;
ALTER TABLE treatment_sessions ADD COLUMN IF NOT EXISTS procedure_performed TEXT;
ALTER TABLE treatment_sessions ADD COLUMN IF NOT EXISTS doctor_note TEXT;
ALTER TABLE treatment_sessions ADD COLUMN IF NOT EXISTS patient_response TEXT;
ALTER TABLE treatment_sessions ADD COLUMN IF NOT EXISTS next_appointment_date DATE;
ALTER TABLE treatment_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TRIGGER trg_treatment_sessions_updated_at
    BEFORE UPDATE ON treatment_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Treatment service items
ALTER TABLE treatment_services ADD COLUMN IF NOT EXISTS tooth_code VARCHAR(20);
ALTER TABLE treatment_services ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE treatment_services ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2);
ALTER TABLE treatment_services ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE treatment_services ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE treatment_services
SET subtotal = quantity * unit_price - COALESCE(discount_amount, 0)
WHERE subtotal IS NULL;

-- Invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_code VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS final_amount NUMERIC(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issued_by UUID REFERENCES users(id);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

UPDATE invoices
SET final_amount = total_amount - COALESCE(discount_amount, 0),
    remaining_amount = total_amount - COALESCE(discount_amount, 0) - paid_amount
WHERE final_amount IS NULL OR remaining_amount IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_invoices_invoice_code ON invoices(invoice_code);

-- Payments
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_code VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_code VARCHAR(100);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS received_by UUID REFERENCES users(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'success';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS ux_payments_payment_code ON payments(payment_code);

DO $$
DECLARE constraint_name text;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'payments'::regclass
      AND pg_get_constraintdef(oid) LIKE '%method%CHECK%';
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE payments DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_method_check;
ALTER TABLE payments
    ADD CONSTRAINT payments_method_check CHECK (method IN (
        'cash', 'banking', 'momo', 'vnpay', 'other', 'transfer', 'card'
    ));

ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
ALTER TABLE payments
    ADD CONSTRAINT payments_status_check CHECK (status IN ('success', 'pending', 'failed', 'cancelled'));

-- Medicines
ALTER TABLE medicines ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 0;
ALTER TABLE medicines ADD COLUMN IF NOT EXISTS active_ingredient VARCHAR(100);
ALTER TABLE medicines ADD COLUMN IF NOT EXISTS concentration VARCHAR(100);
ALTER TABLE medicines ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(100);
ALTER TABLE medicines ADD COLUMN IF NOT EXISTS usage_note TEXT;

-- Services
ALTER TABLE services ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE services ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE services ADD COLUMN IF NOT EXISTS estimated_duration INTEGER;
ALTER TABLE services ADD COLUMN IF NOT EXISTS default_unit VARCHAR(50);
CREATE UNIQUE INDEX IF NOT EXISTS ux_services_code ON services(code);

-- Doctors
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS license_number VARCHAR(50);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS degree VARCHAR(100);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS years_of_experience INTEGER;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS room VARCHAR(50);

-- Doctor schedules
ALTER TABLE doctor_schedules ADD COLUMN IF NOT EXISTS room VARCHAR(50);
ALTER TABLE doctor_schedules ADD COLUMN IF NOT EXISTS max_patients INTEGER;
ALTER TABLE doctor_schedules ADD COLUMN IF NOT EXISTS effective_from DATE;
ALTER TABLE doctor_schedules ADD COLUMN IF NOT EXISTS effective_to DATE;

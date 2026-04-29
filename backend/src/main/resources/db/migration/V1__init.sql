-- EXTENSION
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ================= USERS =================
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password TEXT NOT NULL,
                       role VARCHAR(20) NOT NULL
                           CHECK (role IN ('admin', 'receptionist', 'dentist')),
                       status VARCHAR(20) DEFAULT 'active',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= PATIENTS =================
CREATE TABLE patients (
                          id SERIAL PRIMARY KEY,
                          user_id INT UNIQUE,
                          phone VARCHAR(20) UNIQUE NOT NULL,
                          gender VARCHAR(10)
                              CHECK (gender IN ('male','female','other')),
                          date_of_birth DATE,
                          address TEXT,
                          medical_history TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ================= DOCTORS =================
CREATE TABLE doctors (
                         id SERIAL PRIMARY KEY,
                         user_id INT UNIQUE NOT NULL,
                         specialization VARCHAR(100),
                         experience_years INT,
                         phone VARCHAR(20),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================= CHAIRS =================
CREATE TABLE chairs (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(50) NOT NULL,
                        status VARCHAR(20) DEFAULT 'active',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= APPOINTMENTS =================
CREATE TABLE appointments (
                              id SERIAL PRIMARY KEY,
                              patient_id INT NOT NULL,
                              doctor_id INT NOT NULL,
                              chair_id INT,
                              start_time TIMESTAMP NOT NULL,
                              end_time TIMESTAMP NOT NULL,
                              status VARCHAR(20) DEFAULT 'pending'
                                  CHECK (status IN (
                                                    'pending',
                                                    'confirmed',
                                                    'in_progress',
                                                    'done',
                                                    'cancel',
                                                    'no_show',
                                                    'rescheduled'
                                      )),
                              note TEXT,
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                              FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                              FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
                              FOREIGN KEY (chair_id) REFERENCES chairs(id),

                              CHECK (start_time < end_time)
);

-- chống trùng lịch doctor
ALTER TABLE appointments
    ADD CONSTRAINT no_overlap_doctor
    EXCLUDE USING gist (
    doctor_id WITH =,
    tsrange(start_time, end_time) WITH &&
);

-- chống trùng ghế
ALTER TABLE appointments
    ADD CONSTRAINT no_overlap_chair
    EXCLUDE USING gist (
    chair_id WITH =,
    tsrange(start_time, end_time) WITH &&
);

-- ================= TEETH =================
CREATE TABLE teeth (
                       code VARCHAR(5) PRIMARY KEY
);

-- ================= PATIENT_TEETH =================
CREATE TABLE patient_teeth (
                               id SERIAL PRIMARY KEY,
                               patient_id INT,
                               tooth_code VARCHAR(5),
                               status VARCHAR(50),
                               note TEXT,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                               UNIQUE(patient_id, tooth_code),

                               FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                               FOREIGN KEY (tooth_code) REFERENCES teeth(code)
);

-- ================= TREATMENTS =================
CREATE TABLE treatments (
                            id SERIAL PRIMARY KEY,
                            patient_id INT NOT NULL,
                            doctor_id INT NOT NULL,
                            status VARCHAR(20)
                                CHECK (status IN ('planned','in_progress','completed')),
                            diagnosis TEXT,
                            note TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                            FOREIGN KEY (patient_id) REFERENCES patients(id),
                            FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- ================= TREATMENT SESSIONS =================
CREATE TABLE treatment_sessions (
                                    id SERIAL PRIMARY KEY,
                                    treatment_id INT,
                                    appointment_id INT UNIQUE,
                                    note TEXT,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                    FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
                                    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- ================= TREATMENT TEETH =================
CREATE TABLE treatment_teeth (
                                 treatment_id INT,
                                 tooth_code VARCHAR(5),
                                 PRIMARY KEY (treatment_id, tooth_code),

                                 FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
                                 FOREIGN KEY (tooth_code) REFERENCES teeth(code)
);

-- ================= SERVICES =================
CREATE TABLE services (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
                          duration_minutes INT,
                          description TEXT
);

-- ================= TREATMENT SERVICES =================
CREATE TABLE treatment_services (
                                    id SERIAL PRIMARY KEY,
                                    treatment_id INT,
                                    service_id INT,
                                    service_name VARCHAR(100),
                                    quantity INT DEFAULT 1 CHECK (quantity > 0),
                                    price DECIMAL(10,2) CHECK (price >= 0),

                                    FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
                                    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- ================= INVOICES =================
CREATE TABLE invoices (
                          id SERIAL PRIMARY KEY,
                          patient_id INT NOT NULL,
                          status VARCHAR(20)
                              CHECK (status IN ('unpaid','partial','paid')),
                          total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- ================= INVOICE ITEMS =================
CREATE TABLE invoice_items (
                               id SERIAL PRIMARY KEY,
                               invoice_id INT NOT NULL,
                               treatment_id INT NOT NULL,
                               amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),

                               FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
                               FOREIGN KEY (treatment_id) REFERENCES treatments(id)
);

-- ================= PAYMENTS =================
CREATE TABLE payments (
                          id SERIAL PRIMARY KEY,
                          invoice_id INT,
                          amount DECIMAL(10,2) CHECK (amount >= 0),
                          method VARCHAR(20)
                              CHECK (method IN ('cash','banking','momo','vnpay')),
                          paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- ================= MEDICINES =================
CREATE TABLE medicines (
                           id SERIAL PRIMARY KEY,
                           name VARCHAR(100),
                           unit VARCHAR(20),
                           price DECIMAL(10,2) CHECK (price >= 0),
                           stock INT DEFAULT 0 CHECK (stock >= 0),
                           batch_number VARCHAR(50),
                           expiry_date DATE
);

-- ================= PRESCRIPTIONS =================
CREATE TABLE prescriptions (
                               id SERIAL PRIMARY KEY,
                               treatment_id INT UNIQUE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                               FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
);

-- ================= PRESCRIPTION ITEMS =================
CREATE TABLE prescription_items (
                                    prescription_id INT,
                                    medicine_id INT,
                                    quantity INT CHECK (quantity > 0),
                                    dosage TEXT,

                                    PRIMARY KEY (prescription_id, medicine_id),

                                    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
                                    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

-- ================= MEDICAL IMAGES =================
CREATE TABLE medical_images (
                                id SERIAL PRIMARY KEY,
                                patient_id INT,
                                treatment_id INT,
                                tooth_code VARCHAR(5),
                                image_url TEXT,
                                type VARCHAR(50),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                FOREIGN KEY (patient_id) REFERENCES patients(id),
                                FOREIGN KEY (treatment_id) REFERENCES treatments(id)
);

-- ================= INDEXES =================
CREATE INDEX idx_patient_phone ON patients(phone);
CREATE INDEX idx_user_email ON users(email);

CREATE INDEX idx_appointment_time ON appointments(start_time);
CREATE INDEX idx_appointment_doctor_time ON appointments(doctor_id, start_time);
CREATE INDEX idx_appointment_patient ON appointments(patient_id);

CREATE INDEX idx_invoice_patient ON invoices(patient_id);
CREATE INDEX idx_payment_invoice ON payments(invoice_id);

CREATE INDEX idx_treatment_patient ON treatments(patient_id);
CREATE INDEX idx_treatment_doctor ON treatments(doctor_id);
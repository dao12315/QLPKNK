-- =========================================================
-- V2__seed_data.sql
-- Seed users + patients + doctors
-- Password gốc cho tất cả account: 123456
--
-- BCrypt hash generate từ:
-- new BCryptPasswordEncoder().encode("123456")
-- =========================================================

-- =========================================================
-- USERS
-- =========================================================

INSERT INTO users (
    id,
    name,
    email,
    password,
    role,
    status
)
VALUES
    (
        gen_random_uuid(),
        'System Admin',
        'admin@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'admin',
        'active'
    ),
    (
        gen_random_uuid(),
        'Receptionist',
        'reception@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'receptionist',
        'active'
    ),
    (
        gen_random_uuid(),
        'Dr. Nguyen Van A',
        'doctor1@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'dentist',
        'active'
    ),
    (
        gen_random_uuid(),
        'Dr. Tran Thi B',
        'doctor2@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'dentist',
        'active'
    ),
    (
        gen_random_uuid(),
        'Nguyen Van Patient',
        'patient1@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'patient',
        'active'
    );

-- =========================================================
-- DOCTORS
-- =========================================================

INSERT INTO doctors (
    id,
    user_id,
    full_name,
    specialization,
    experience_years,
    phone
)
SELECT
    gen_random_uuid(),
    u.id,
    u.name,
    'General Dentistry',
    5,
    '0900000001'
FROM users u
WHERE u.email = 'doctor1@gmail.com';

INSERT INTO doctors (
    id,
    user_id,
    full_name,
    specialization,
    experience_years,
    phone
)
SELECT
    gen_random_uuid(),
    u.id,
    u.name,
    'Orthodontics',
    8,
    '0900000002'
FROM users u
WHERE u.email = 'doctor2@gmail.com';

-- =========================================================
-- PATIENTS
-- =========================================================

INSERT INTO patients (
    id,
    user_id,
    full_name,
    phone,
    gender,
    date_of_birth,
    address,
    medical_history
)
SELECT
    gen_random_uuid(),
    u.id,
    u.name,
    '0912345678',
    'male',
    DATE '2000-01-01',
    'Ha Noi',
    'No allergy'
FROM users u
WHERE u.email = 'patient1@gmail.com';
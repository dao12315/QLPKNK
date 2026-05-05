-- =========================================
-- V2: ADD PATIENT ROLE TO USERS TABLE
-- =========================================

-- 1. CHECK EXISTING INVALID DATA
-- (optional nhưng nên chạy để debug trước)
SELECT *
FROM users
WHERE role NOT IN ('admin', 'receptionist', 'dentist', 'patient');


-- 2. FIX OLD DATA IF ANY INVALID ROLE EXISTS
-- (tránh lỗi khi add constraint)
UPDATE users
SET role = 'receptionist'
WHERE role NOT IN ('admin', 'receptionist', 'dentist', 'patient');


-- 3. DROP OLD CONSTRAINT
-- Flyway safe: IF EXISTS để tránh fail migration
ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_role_check;


-- 4. ADD NEW CONSTRAINT WITH PATIENT ROLE
ALTER TABLE users
    ADD CONSTRAINT users_role_check
        CHECK (role IN ('admin', 'receptionist', 'dentist', 'patient'));


-- 5. VERIFY RESULT (optional)
-- SELECT DISTINCT role FROM users;
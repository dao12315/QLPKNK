-- Full clinic demo seed data for testing frontend/backend flows.
-- Idempotent: fixed UUIDs plus ON CONFLICT upserts, no truncate/drop.
-- doctor_schedules.day_of_week uses the existing 0-6 schema: Sunday=0, Monday=1, ..., Saturday=6.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Password: 123456, BCrypt.
WITH seed_users(id, name, email, password, role, status) AS (
    VALUES
        ('10000000-0000-0000-0000-000000000001'::uuid, 'Quản trị viên', 'admin@clinic.com', '$2a$10$iU6CKQDNQ6Zq2Y1ULcEZuew5KkjKy.hN3W8GPI5wSz7eGPvk4Z4yO', 'admin', 'active'),
        ('10000000-0000-0000-0000-000000000002'::uuid, 'Nguyễn Thu Hà', 'receptionist@clinic.com', '$2a$10$iU6CKQDNQ6Zq2Y1ULcEZuew5KkjKy.hN3W8GPI5wSz7eGPvk4Z4yO', 'receptionist', 'active'),
        ('10000000-0000-0000-0000-000000000003'::uuid, 'Bác sĩ Trần Minh Đức', 'dentist1@clinic.com', '$2a$10$iU6CKQDNQ6Zq2Y1ULcEZuew5KkjKy.hN3W8GPI5wSz7eGPvk4Z4yO', 'dentist', 'active'),
        ('10000000-0000-0000-0000-000000000004'::uuid, 'Bác sĩ Phạm Lan Anh', 'dentist2@clinic.com', '$2a$10$iU6CKQDNQ6Zq2Y1ULcEZuew5KkjKy.hN3W8GPI5wSz7eGPvk4Z4yO', 'dentist', 'active'),
        ('10000000-0000-0000-0000-000000000005'::uuid, 'Nguyễn Văn Nam', 'patient1@clinic.com', '$2a$10$iU6CKQDNQ6Zq2Y1ULcEZuew5KkjKy.hN3W8GPI5wSz7eGPvk4Z4yO', 'patient', 'active')
)
INSERT INTO users (id, name, email, password, role, status)
SELECT * FROM seed_users
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_doctors(id, email, specialization, experience_years, phone, license_number, degree, years_of_experience, room) AS (
    VALUES
        ('20000000-0000-0000-0000-000000000001'::uuid, 'dentist1@clinic.com', 'Nha khoa tổng quát, điều trị tủy', 8, '0900000003', 'CCHN-001-2026', 'Thạc sĩ Răng Hàm Mặt', 8, 'Phòng khám 01'),
        ('20000000-0000-0000-0000-000000000002'::uuid, 'dentist2@clinic.com', 'Chỉnh nha, thẩm mỹ răng', 6, '0900000004', 'CCHN-002-2026', 'Bác sĩ Răng Hàm Mặt', 6, 'Phòng khám 02')
)
INSERT INTO doctors (id, user_id, full_name, specialization, experience_years, phone, license_number, degree, years_of_experience, room)
SELECT d.id, u.id, u.name, d.specialization, d.experience_years, d.phone, d.license_number, d.degree, d.years_of_experience, d.room
FROM seed_doctors d
JOIN users u ON u.email = d.email
ON CONFLICT (user_id) DO UPDATE
SET full_name = EXCLUDED.full_name,
    specialization = EXCLUDED.specialization,
    experience_years = EXCLUDED.experience_years,
    phone = EXCLUDED.phone,
    license_number = EXCLUDED.license_number,
    degree = EXCLUDED.degree,
    years_of_experience = EXCLUDED.years_of_experience,
    room = EXCLUDED.room,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_schedules(id, doctor_email, day_of_week, start_time, end_time, room, max_patients, effective_from) AS (
    VALUES
        ('21000000-0000-0000-0000-000000000001'::uuid, 'dentist1@clinic.com', 1::smallint, TIME '08:00', TIME '12:00', 'Phòng khám 01', 8, DATE '2026-06-01'),
        ('21000000-0000-0000-0000-000000000002'::uuid, 'dentist1@clinic.com', 3::smallint, TIME '13:30', TIME '17:30', 'Phòng khám 01', 8, DATE '2026-06-01'),
        ('21000000-0000-0000-0000-000000000003'::uuid, 'dentist1@clinic.com', 5::smallint, TIME '08:00', TIME '17:00', 'Phòng khám 01', 12, DATE '2026-06-01'),
        ('21000000-0000-0000-0000-000000000004'::uuid, 'dentist2@clinic.com', 2::smallint, TIME '08:00', TIME '12:00', 'Phòng khám 02', 8, DATE '2026-06-01'),
        ('21000000-0000-0000-0000-000000000005'::uuid, 'dentist2@clinic.com', 4::smallint, TIME '13:30', TIME '17:30', 'Phòng khám 02', 8, DATE '2026-06-01'),
        ('21000000-0000-0000-0000-000000000006'::uuid, 'dentist2@clinic.com', 6::smallint, TIME '08:00', TIME '12:00', 'Phòng khám 02', 6, DATE '2026-06-01')
)
INSERT INTO doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, is_active, room, max_patients, effective_from)
SELECT s.id, d.id, s.day_of_week, s.start_time, s.end_time, TRUE, s.room, s.max_patients, s.effective_from
FROM seed_schedules s
JOIN users u ON u.email = s.doctor_email
JOIN doctors d ON d.user_id = u.id
ON CONFLICT (id) DO UPDATE
SET doctor_id = EXCLUDED.doctor_id,
    day_of_week = EXCLUDED.day_of_week,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    is_active = TRUE,
    room = EXCLUDED.room,
    max_patients = EXCLUDED.max_patients,
    effective_from = EXCLUDED.effective_from;

WITH seed_services(id, code, category, name, price, estimated_duration, default_unit, description) AS (
    VALUES
        ('30000000-0000-0000-0000-000000000001'::uuid, 'DV001', 'Điều trị', 'Điều trị tủy bằng máy', 1200000::numeric, 60, 'răng', 'Điều trị tủy răng bằng hệ thống máy nội nha hiện đại, giúp làm sạch ống tủy chính xác và giảm đau.'),
        ('30000000-0000-0000-0000-000000000002'::uuid, 'DV002', 'Chẩn đoán hình ảnh', 'Chụp phim X-quang răng kỹ thuật số', 150000::numeric, 15, 'lần', 'Chụp phim X-quang kỹ thuật số hỗ trợ chẩn đoán sâu răng, viêm quanh chóp, mọc lệch răng khôn và lập kế hoạch điều trị.'),
        ('30000000-0000-0000-0000-000000000003'::uuid, 'DV003', 'Hỗ trợ điều trị', 'Máy định vị chóp chính xác', 300000::numeric, 20, 'lần', 'Sử dụng máy định vị chóp giúp xác định chiều dài ống tủy chính xác trong quá trình điều trị nội nha.'),
        ('30000000-0000-0000-0000-000000000004'::uuid, 'DV004', 'Phục hình', 'Cấy ghép Implant', 15000000::numeric, 90, 'trụ', 'Cấy ghép trụ Implant thay thế răng mất, phục hồi chức năng ăn nhai và thẩm mỹ.'),
        ('30000000-0000-0000-0000-000000000005'::uuid, 'DV005', 'Thẩm mỹ', 'Thẩm mỹ răng', 2500000::numeric, 60, 'răng', 'Dịch vụ cải thiện màu sắc, hình thể và thẩm mỹ nụ cười.'),
        ('30000000-0000-0000-0000-000000000006'::uuid, 'DV006', 'Chỉnh nha', 'Nắn chỉnh răng', 25000000::numeric, 120, 'liệu trình', 'Nắn chỉnh răng giúp cải thiện khớp cắn, sắp đều răng và nâng cao thẩm mỹ.'),
        ('30000000-0000-0000-0000-000000000007'::uuid, 'DV007', 'Khám', 'Khám và tư vấn nha khoa', 100000::numeric, 20, 'lần', 'Khám tổng quát và tư vấn kế hoạch chăm sóc răng miệng.'),
        ('30000000-0000-0000-0000-000000000008'::uuid, 'DV008', 'Vệ sinh răng miệng', 'Lấy cao răng', 300000::numeric, 30, 'lần', 'Làm sạch cao răng, mảng bám và hướng dẫn vệ sinh răng miệng.')
)
INSERT INTO services (id, code, category, name, price, duration_minutes, estimated_duration, default_unit, description, is_active)
SELECT id, code, category, name, price, estimated_duration, estimated_duration, default_unit, description, TRUE
FROM seed_services
ON CONFLICT (code) DO UPDATE
SET category = EXCLUDED.category,
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    duration_minutes = EXCLUDED.duration_minutes,
    estimated_duration = EXCLUDED.estimated_duration,
    default_unit = EXCLUDED.default_unit,
    description = EXCLUDED.description,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_medicines(id, name, unit, stock, price, batch_number, expiry_date, min_stock, active_ingredient, concentration, manufacturer, usage_note) AS (
    VALUES
        ('40000000-0000-0000-0000-000000000001'::uuid, 'Amoxicillin 500mg', 'viên', 200, 3000::numeric, 'AMX-2026-001', DATE '2027-12-31', 30, 'Amoxicillin', '500mg', 'Dược Hậu Giang', 'Kháng sinh dùng theo chỉ định bác sĩ.'),
        ('40000000-0000-0000-0000-000000000002'::uuid, 'Ibuprofen 400mg', 'viên', 150, 2500::numeric, 'IBU-2026-001', DATE '2027-10-31', 30, 'Ibuprofen', '400mg', 'Traphaco', 'Thuốc giảm đau, kháng viêm.'),
        ('40000000-0000-0000-0000-000000000003'::uuid, 'Paracetamol 500mg', 'viên', 250, 1500::numeric, 'PARA-2026-001', DATE '2027-09-30', 40, 'Paracetamol', '500mg', 'Pymepharco', 'Thuốc giảm đau, hạ sốt.'),
        ('40000000-0000-0000-0000-000000000004'::uuid, 'Metronidazole 250mg', 'viên', 120, 2000::numeric, 'MET-2026-001', DATE '2027-08-31', 20, 'Metronidazole', '250mg', 'Domesco', 'Thuốc kháng khuẩn dùng theo đơn.'),
        ('40000000-0000-0000-0000-000000000005'::uuid, 'Nước súc miệng Chlorhexidine', 'chai', 40, 45000::numeric, 'CHX-2026-001', DATE '2027-06-30', 10, 'Chlorhexidine', '0.12%', 'Dược phẩm Việt Nam', 'Súc miệng sau điều trị theo chỉ định.'),
        ('40000000-0000-0000-0000-000000000006'::uuid, 'Lidocaine Spray', 'chai', 5, 70000::numeric, 'LIDO-2026-LOW', DATE '2026-09-30', 10, 'Lidocaine', '10%', 'Dược phẩm Việt Nam', 'Thuốc gây tê tại chỗ.')
)
INSERT INTO medicines (id, name, unit, stock, price, batch_number, expiry_date, min_stock, active_ingredient, concentration, manufacturer, usage_note)
SELECT * FROM seed_medicines
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    unit = EXCLUDED.unit,
    stock = EXCLUDED.stock,
    price = EXCLUDED.price,
    batch_number = EXCLUDED.batch_number,
    expiry_date = EXCLUDED.expiry_date,
    min_stock = EXCLUDED.min_stock,
    active_ingredient = EXCLUDED.active_ingredient,
    concentration = EXCLUDED.concentration,
    manufacturer = EXCLUDED.manufacturer,
    usage_note = EXCLUDED.usage_note,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_patients(id, user_email, full_name, email, phone, gender, date_of_birth, address, identity_number, occupation, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, status, note) AS (
    VALUES
        ('50000000-0000-0000-0000-000000000001'::uuid, 'patient1@clinic.com', 'Nguyễn Văn Nam', 'patient1@clinic.com', '0911111111', 'male', DATE '1998-05-12', 'Cầu Giấy, Hà Nội', '001098000001', 'Nhân viên văn phòng', 'Nguyễn Thị Hoa', '0981111111', 'Mẹ', 'active', 'Bệnh nhân có tài khoản đăng nhập.'),
        ('50000000-0000-0000-0000-000000000002'::uuid, NULL, 'Trần Thị Mai', 'tranthimai@example.com', '0922222222', 'female', DATE '2001-09-20', 'Hà Đông, Hà Nội', '001101000002', 'Sinh viên', 'Trần Văn Bình', '0982222222', 'Bố', 'active', NULL),
        ('50000000-0000-0000-0000-000000000003'::uuid, NULL, 'Lê Hoàng Long', 'lehoanglong@example.com', '0933333333', 'male', DATE '1987-03-15', 'Thanh Xuân, Hà Nội', '001087000003', 'Kinh doanh', 'Phạm Thu Hương', '0983333333', 'Vợ', 'active', NULL),
        ('50000000-0000-0000-0000-000000000004'::uuid, NULL, 'Phạm Ngọc Anh', 'phamngocanh@example.com', '0944444444', 'female', DATE '1995-11-02', 'Đống Đa, Hà Nội', '001095000004', 'Giáo viên', 'Phạm Văn Sơn', '0984444444', 'Anh trai', 'active', NULL),
        ('50000000-0000-0000-0000-000000000005'::uuid, NULL, 'Đỗ Minh Quân', 'dominhquan@example.com', '0955555555', 'male', DATE '1979-07-08', 'Hoàng Mai, Hà Nội', '001079000005', 'Kỹ sư', 'Đỗ Thị Lan', '0985555555', 'Vợ', 'active', NULL),
        ('50000000-0000-0000-0000-000000000006'::uuid, NULL, 'Vũ Thu Trang', 'vuthutrang@example.com', '0966666666', 'female', DATE '2004-01-25', 'Chương Mỹ, Hà Nội', '001104000006', 'Sinh viên', 'Vũ Văn Hùng', '0986666666', 'Bố', 'active', NULL)
)
INSERT INTO patients (id, user_id, full_name, email, phone, gender, date_of_birth, address, identity_number, occupation, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, status, note)
SELECT p.id, u.id, p.full_name, p.email, p.phone, p.gender, p.date_of_birth, p.address, p.identity_number, p.occupation, p.emergency_contact_name, p.emergency_contact_phone, p.emergency_contact_relationship, p.status, p.note
FROM seed_patients p
LEFT JOIN users u ON u.email = p.user_email
ON CONFLICT (id) DO UPDATE
SET user_id = EXCLUDED.user_id,
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    gender = EXCLUDED.gender,
    date_of_birth = EXCLUDED.date_of_birth,
    address = EXCLUDED.address,
    identity_number = EXCLUDED.identity_number,
    occupation = EXCLUDED.occupation,
    emergency_contact_name = EXCLUDED.emergency_contact_name,
    emergency_contact_phone = EXCLUDED.emergency_contact_phone,
    emergency_contact_relationship = EXCLUDED.emergency_contact_relationship,
    status = EXCLUDED.status,
    note = EXCLUDED.note,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_medical(id, patient_id, medical_history, allergies, current_medications, chronic_diseases, blood_pressure, heart_disease, diabetes, hepatitis, asthma, is_pregnant, is_breastfeeding, medical_note) AS (
    VALUES
        ('51000000-0000-0000-0000-000000000001'::uuid, '50000000-0000-0000-0000-000000000001'::uuid, 'Không có bệnh lý nghiêm trọng.', 'Không ghi nhận dị ứng thuốc.', 'Không.', 'Không.', '120/80', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'Có thể điều trị nha khoa thông thường.'),
        ('51000000-0000-0000-0000-000000000002'::uuid, '50000000-0000-0000-0000-000000000002'::uuid, 'Tiền sử viêm dạ dày nhẹ.', 'Dị ứng Penicillin.', 'Không.', 'Viêm dạ dày.', '110/70', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'Tránh kê thuốc nhóm Penicillin.'),
        ('51000000-0000-0000-0000-000000000003'::uuid, '50000000-0000-0000-0000-000000000003'::uuid, 'Có tiền sử tăng huyết áp.', 'Không rõ.', 'Thuốc huyết áp uống hằng ngày.', 'Tăng huyết áp.', '140/90', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'Cần kiểm tra huyết áp trước can thiệp.'),
        ('51000000-0000-0000-0000-000000000004'::uuid, '50000000-0000-0000-0000-000000000004'::uuid, 'Không có bệnh nền.', 'Không.', 'Không.', 'Không.', '115/75', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'Phù hợp điều trị thẩm mỹ.'),
        ('51000000-0000-0000-0000-000000000005'::uuid, '50000000-0000-0000-0000-000000000005'::uuid, 'Tiểu đường type 2.', 'Không.', 'Thuốc kiểm soát đường huyết.', 'Tiểu đường.', '130/85', FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 'Cần lưu ý lành thương sau nhổ răng/implant.'),
        ('51000000-0000-0000-0000-000000000006'::uuid, '50000000-0000-0000-0000-000000000006'::uuid, 'Hen suyễn nhẹ.', 'Không.', 'Thuốc xịt khi cần.', 'Hen suyễn.', '110/70', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, 'Cần hỏi tình trạng hô hấp trước điều trị.')
)
INSERT INTO patient_medical_info (id, patient_id, medical_history, allergies, current_medications, chronic_diseases, blood_pressure, heart_disease, diabetes, hepatitis, asthma, is_pregnant, is_breastfeeding, medical_note)
SELECT * FROM seed_medical
ON CONFLICT (patient_id) DO UPDATE
SET medical_history = EXCLUDED.medical_history,
    allergies = EXCLUDED.allergies,
    current_medications = EXCLUDED.current_medications,
    chronic_diseases = EXCLUDED.chronic_diseases,
    blood_pressure = EXCLUDED.blood_pressure,
    heart_disease = EXCLUDED.heart_disease,
    diabetes = EXCLUDED.diabetes,
    hepatitis = EXCLUDED.hepatitis,
    asthma = EXCLUDED.asthma,
    is_pregnant = EXCLUDED.is_pregnant,
    is_breastfeeding = EXCLUDED.is_breastfeeding,
    medical_note = EXCLUDED.medical_note,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_dental(id, patient_id, chief_complaint, dental_history, tooth_pain_location, pain_level, gum_bleeding, tooth_sensitivity, bad_breath, cavities, brushing_frequency, flossing_habit, dental_note) AS (
    VALUES
        ('52000000-0000-0000-0000-000000000001'::uuid, '50000000-0000-0000-0000-000000000001'::uuid, 'Đau răng hàm dưới bên trái.', 'Đã từng trám răng số 36.', '36', 7, FALSE, TRUE, FALSE, TRUE, '2 lần/ngày', 'Thỉnh thoảng', 'Nghi ngờ viêm tủy răng 36.'),
        ('52000000-0000-0000-0000-000000000002'::uuid, '50000000-0000-0000-0000-000000000002'::uuid, 'Muốn kiểm tra răng khôn và chụp phim.', 'Chưa từng điều trị nha khoa lớn.', '38', 5, TRUE, FALSE, FALSE, FALSE, '2 lần/ngày', 'Không dùng', 'Cần chụp X-quang kiểm tra răng khôn.'),
        ('52000000-0000-0000-0000-000000000003'::uuid, '50000000-0000-0000-0000-000000000003'::uuid, 'Mất răng hàm, muốn tư vấn Implant.', 'Đã nhổ răng số 46.', '46', 2, FALSE, FALSE, FALSE, FALSE, '2 lần/ngày', 'Có dùng', 'Cần tư vấn cấy ghép Implant vùng răng 46.'),
        ('52000000-0000-0000-0000-000000000004'::uuid, '50000000-0000-0000-0000-000000000004'::uuid, 'Muốn cải thiện thẩm mỹ răng cửa.', 'Từng lấy cao răng.', NULL, 0, FALSE, TRUE, FALSE, FALSE, '2 lần/ngày', 'Có dùng', 'Tư vấn thẩm mỹ răng vùng răng cửa.'),
        ('52000000-0000-0000-0000-000000000005'::uuid, '50000000-0000-0000-0000-000000000005'::uuid, 'Đau răng khi ăn nhai.', 'Có răng sâu lâu ngày.', '47', 8, TRUE, TRUE, FALSE, TRUE, '1 lần/ngày', 'Không dùng', 'Cần đánh giá sâu răng lớn, có thể điều trị tủy hoặc nhổ.'),
        ('52000000-0000-0000-0000-000000000006'::uuid, '50000000-0000-0000-0000-000000000006'::uuid, 'Răng lệch lạc, muốn nắn chỉnh.', 'Chưa chỉnh nha.', NULL, 0, FALSE, FALSE, FALSE, FALSE, '2 lần/ngày', 'Thỉnh thoảng', 'Tư vấn chỉnh nha tổng quát.')
)
INSERT INTO patient_dental_info (id, patient_id, chief_complaint, dental_history, tooth_pain_location, pain_level, gum_bleeding, tooth_sensitivity, bad_breath, cavities, brushing_frequency, flossing_habit, dental_note)
SELECT * FROM seed_dental
ON CONFLICT (patient_id) DO UPDATE
SET chief_complaint = EXCLUDED.chief_complaint,
    dental_history = EXCLUDED.dental_history,
    tooth_pain_location = EXCLUDED.tooth_pain_location,
    pain_level = EXCLUDED.pain_level,
    gum_bleeding = EXCLUDED.gum_bleeding,
    tooth_sensitivity = EXCLUDED.tooth_sensitivity,
    bad_breath = EXCLUDED.bad_breath,
    cavities = EXCLUDED.cavities,
    brushing_frequency = EXCLUDED.brushing_frequency,
    flossing_habit = EXCLUDED.flossing_habit,
    dental_note = EXCLUDED.dental_note,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_appointments(id, patient_id, doctor_email, start_time, end_time, status, reason, symptoms, priority, note, cancel_reason, cancellation_reason, confirmed_at, checked_in_at, completed_at) AS (
    VALUES
        ('60000000-0000-0000-0000-000000000001'::uuid, '50000000-0000-0000-0000-000000000001'::uuid, 'dentist1@clinic.com', TIMESTAMP '2026-06-05 08:00', TIMESTAMP '2026-06-05 09:00', 'confirmed', 'Đau răng hàm dưới', 'Đau nhức răng 36, ê buốt khi uống lạnh', 'high', 'Khám và đánh giá điều trị tủy', NULL, NULL, TIMESTAMP '2026-06-04 09:00', NULL, NULL),
        ('60000000-0000-0000-0000-000000000002'::uuid, '50000000-0000-0000-0000-000000000002'::uuid, 'dentist1@clinic.com', TIMESTAMP '2026-06-05 09:30', TIMESTAMP '2026-06-05 10:00', 'pending', 'Chụp phim kiểm tra răng khôn', 'Đau âm ỉ vùng răng 38', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
        ('60000000-0000-0000-0000-000000000003'::uuid, '50000000-0000-0000-0000-000000000003'::uuid, 'dentist2@clinic.com', TIMESTAMP '2026-06-06 14:00', TIMESTAMP '2026-06-06 15:00', 'confirmed', 'Tư vấn cấy ghép Implant', 'Mất răng 46, ăn nhai kém', 'normal', NULL, NULL, NULL, TIMESTAMP '2026-06-05 08:30', NULL, NULL),
        ('60000000-0000-0000-0000-000000000004'::uuid, '50000000-0000-0000-0000-000000000004'::uuid, 'dentist2@clinic.com', TIMESTAMP '2026-06-07 08:30', TIMESTAMP '2026-06-07 09:30', 'done', 'Tư vấn thẩm mỹ răng', 'Răng cửa xỉn màu', 'normal', NULL, NULL, NULL, TIMESTAMP '2026-06-06 09:00', TIMESTAMP '2026-06-07 08:25', TIMESTAMP '2026-06-07 09:30'),
        ('60000000-0000-0000-0000-000000000005'::uuid, '50000000-0000-0000-0000-000000000005'::uuid, 'dentist1@clinic.com', TIMESTAMP '2026-06-07 10:00', TIMESTAMP '2026-06-07 11:00', 'in_progress', 'Đau răng khi ăn nhai', 'Đau nhiều răng 47, sâu răng lớn', 'urgent', NULL, NULL, NULL, TIMESTAMP '2026-06-06 10:00', TIMESTAMP '2026-06-07 09:55', NULL),
        ('60000000-0000-0000-0000-000000000006'::uuid, '50000000-0000-0000-0000-000000000006'::uuid, 'dentist2@clinic.com', TIMESTAMP '2026-06-08 15:00', TIMESTAMP '2026-06-08 16:00', 'pending', 'Tư vấn nắn chỉnh răng', 'Răng lệch lạc, chen chúc', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
        ('60000000-0000-0000-0000-000000000007'::uuid, '50000000-0000-0000-0000-000000000001'::uuid, 'dentist1@clinic.com', TIMESTAMP '2026-06-12 08:00', TIMESTAMP '2026-06-12 09:00', 'pending', 'Tái khám điều trị tủy', 'Kiểm tra sau buổi điều trị đầu tiên', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
        ('60000000-0000-0000-0000-000000000008'::uuid, '50000000-0000-0000-0000-000000000003'::uuid, 'dentist2@clinic.com', TIMESTAMP '2026-06-13 09:00', TIMESTAMP '2026-06-13 10:30', 'pending', 'Chụp phim và lập kế hoạch Implant', 'Chuẩn bị cấy ghép Implant', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
        ('60000000-0000-0000-0000-000000000009'::uuid, '50000000-0000-0000-0000-000000000002'::uuid, 'dentist1@clinic.com', TIMESTAMP '2026-06-02 14:00', TIMESTAMP '2026-06-02 14:30', 'cancelled', 'Khám răng khôn', 'Đau nhẹ vùng răng 38', 'normal', NULL, 'Bệnh nhân bận lịch học', 'Bệnh nhân bận lịch học', NULL, NULL, NULL),
        ('60000000-0000-0000-0000-000000000010'::uuid, '50000000-0000-0000-0000-000000000004'::uuid, 'dentist2@clinic.com', TIMESTAMP '2026-06-01 10:00', TIMESTAMP '2026-06-01 10:30', 'no_show', 'Lấy cao răng', 'Cao răng nhiều', 'normal', NULL, NULL, NULL, NULL, NULL, NULL)
)
INSERT INTO appointments (id, patient_id, doctor_id, start_time, end_time, status, reason, symptoms, priority, note, cancel_reason, cancellation_reason, confirmed_at, checked_in_at, completed_at, created_at)
SELECT a.id, a.patient_id, d.id, a.start_time, a.end_time, a.status, a.reason, a.symptoms, a.priority, a.note, a.cancel_reason, a.cancellation_reason, a.confirmed_at, a.checked_in_at, a.completed_at, a.start_time::date - INTERVAL '1 day'
FROM seed_appointments a
JOIN users u ON u.email = a.doctor_email
JOIN doctors d ON d.user_id = u.id
ON CONFLICT (id) DO UPDATE
SET patient_id = EXCLUDED.patient_id,
    doctor_id = EXCLUDED.doctor_id,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    status = EXCLUDED.status,
    reason = EXCLUDED.reason,
    symptoms = EXCLUDED.symptoms,
    priority = EXCLUDED.priority,
    note = EXCLUDED.note,
    cancel_reason = EXCLUDED.cancel_reason,
    cancellation_reason = EXCLUDED.cancellation_reason,
    confirmed_at = EXCLUDED.confirmed_at,
    checked_in_at = EXCLUDED.checked_in_at,
    completed_at = EXCLUDED.completed_at,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_treatments(id, patient_id, doctor_email, status, chief_complaint, clinical_examination, diagnosis, treatment_plan, tooth_codes, tooth_note, follow_up_date, started_at, completed_at, note) AS (
    VALUES
        ('70000000-0000-0000-0000-000000000001'::uuid, '50000000-0000-0000-0000-000000000001'::uuid, 'dentist1@clinic.com', 'in_progress', 'Đau răng hàm dưới bên trái.', 'Răng 36 sâu lớn, đau khi gõ dọc, nghi viêm tủy.', 'Viêm tủy răng 36.', 'Điều trị tủy bằng máy, định vị chóp, phục hồi thân răng sau điều trị.', ARRAY['36'], 'Răng 36 sâu mặt nhai lớn.', DATE '2026-06-12', TIMESTAMP '2026-06-05 08:00', NULL, NULL),
        ('70000000-0000-0000-0000-000000000002'::uuid, '50000000-0000-0000-0000-000000000002'::uuid, 'dentist1@clinic.com', 'planned', 'Đau vùng răng khôn hàm dưới.', 'Nướu vùng răng 38 hơi sưng, nghi răng khôn mọc lệch.', 'Theo dõi răng khôn 38 mọc lệch.', 'Chụp phim X-quang kỹ thuật số để đánh giá hướng mọc răng.', ARRAY['38'], 'Cần đánh giá trên phim.', DATE '2026-06-10', NULL, NULL, NULL),
        ('70000000-0000-0000-0000-000000000003'::uuid, '50000000-0000-0000-0000-000000000003'::uuid, 'dentist2@clinic.com', 'planned', 'Mất răng hàm dưới bên phải.', 'Mất răng 46, vùng lợi ổn định.', 'Mất răng 46.', 'Chụp phim, đánh giá xương hàm và tư vấn cấy ghép Implant.', ARRAY['46'], 'Vùng mất răng 46.', DATE '2026-06-13', NULL, NULL, NULL),
        ('70000000-0000-0000-0000-000000000004'::uuid, '50000000-0000-0000-0000-000000000004'::uuid, 'dentist2@clinic.com', 'completed', 'Muốn cải thiện thẩm mỹ răng cửa.', 'Răng cửa xỉn màu nhẹ, hình thể chưa đều.', 'Nhu cầu thẩm mỹ răng vùng răng cửa.', 'Tư vấn thẩm mỹ răng, lấy cao răng và lập kế hoạch phục hình nếu cần.', ARRAY['11','12','21','22'], 'Nhóm răng cửa trên.', NULL, TIMESTAMP '2026-06-07 08:30', TIMESTAMP '2026-06-07 09:30', NULL),
        ('70000000-0000-0000-0000-000000000005'::uuid, '50000000-0000-0000-0000-000000000005'::uuid, 'dentist1@clinic.com', 'in_progress', 'Đau răng nhiều khi ăn nhai.', 'Răng 47 sâu lớn, đau nhiều, bệnh nhân có tiểu đường.', 'Sâu răng 47 nghi viêm tủy.', 'Chụp phim, điều trị tủy nếu còn chỉ định bảo tồn.', ARRAY['47'], 'Cần lưu ý bệnh nền tiểu đường.', DATE '2026-06-14', TIMESTAMP '2026-06-07 10:00', NULL, NULL),
        ('70000000-0000-0000-0000-000000000006'::uuid, '50000000-0000-0000-0000-000000000006'::uuid, 'dentist2@clinic.com', 'planned', 'Răng chen chúc, muốn nắn chỉnh.', 'Răng cửa chen chúc nhẹ, khớp cắn cần đánh giá thêm.', 'Sai lệch khớp cắn và răng chen chúc nhẹ.', 'Tư vấn nắn chỉnh răng, chụp phim và lấy dấu nếu bệnh nhân đồng ý.', ARRAY[]::text[], 'Toàn hàm.', DATE '2026-06-15', NULL, NULL, NULL)
)
INSERT INTO treatments (id, patient_id, doctor_id, status, chief_complaint, clinical_examination, diagnosis, treatment_plan, tooth_codes, tooth_note, follow_up_date, started_at, completed_at, note)
SELECT t.id, t.patient_id, d.id, t.status, t.chief_complaint, t.clinical_examination, t.diagnosis, t.treatment_plan, t.tooth_codes, t.tooth_note, t.follow_up_date, t.started_at, t.completed_at, t.note
FROM seed_treatments t
JOIN users u ON u.email = t.doctor_email
JOIN doctors d ON d.user_id = u.id
ON CONFLICT (id) DO UPDATE
SET patient_id = EXCLUDED.patient_id,
    doctor_id = EXCLUDED.doctor_id,
    status = EXCLUDED.status,
    chief_complaint = EXCLUDED.chief_complaint,
    clinical_examination = EXCLUDED.clinical_examination,
    diagnosis = EXCLUDED.diagnosis,
    treatment_plan = EXCLUDED.treatment_plan,
    tooth_codes = EXCLUDED.tooth_codes,
    tooth_note = EXCLUDED.tooth_note,
    follow_up_date = EXCLUDED.follow_up_date,
    started_at = EXCLUDED.started_at,
    completed_at = EXCLUDED.completed_at,
    note = EXCLUDED.note,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_treatment_services(id, treatment_id, service_code, tooth_code, quantity, unit_price, discount_amount, note) AS (
    VALUES
        ('71000000-0000-0000-0000-000000000001'::uuid, '70000000-0000-0000-0000-000000000001'::uuid, 'DV001', '36', 1, 1200000::numeric, 0::numeric, 'Điều trị tủy răng 36'),
        ('71000000-0000-0000-0000-000000000002'::uuid, '70000000-0000-0000-0000-000000000001'::uuid, 'DV003', '36', 1, 300000::numeric, 0::numeric, 'Định vị chóp răng 36'),
        ('71000000-0000-0000-0000-000000000003'::uuid, '70000000-0000-0000-0000-000000000001'::uuid, 'DV002', '36', 1, 150000::numeric, 0::numeric, 'Chụp phim răng 36'),
        ('71000000-0000-0000-0000-000000000004'::uuid, '70000000-0000-0000-0000-000000000002'::uuid, 'DV002', '38', 1, 150000::numeric, 0::numeric, 'Chụp phim răng 38'),
        ('71000000-0000-0000-0000-000000000005'::uuid, '70000000-0000-0000-0000-000000000003'::uuid, 'DV002', '46', 1, 150000::numeric, 0::numeric, 'Chụp phim vùng răng 46'),
        ('71000000-0000-0000-0000-000000000006'::uuid, '70000000-0000-0000-0000-000000000003'::uuid, 'DV004', '46', 1, 15000000::numeric, 0::numeric, 'Cấy ghép Implant vùng răng 46'),
        ('71000000-0000-0000-0000-000000000007'::uuid, '70000000-0000-0000-0000-000000000004'::uuid, 'DV005', '11', 1, 2500000::numeric, 0::numeric, 'Thẩm mỹ răng 11'),
        ('71000000-0000-0000-0000-000000000008'::uuid, '70000000-0000-0000-0000-000000000004'::uuid, 'DV005', '21', 1, 2500000::numeric, 0::numeric, 'Thẩm mỹ răng 21'),
        ('71000000-0000-0000-0000-000000000009'::uuid, '70000000-0000-0000-0000-000000000004'::uuid, 'DV008', NULL, 1, 300000::numeric, 0::numeric, 'Lấy cao răng'),
        ('71000000-0000-0000-0000-000000000010'::uuid, '70000000-0000-0000-0000-000000000005'::uuid, 'DV002', '47', 1, 150000::numeric, 0::numeric, 'Chụp phim răng 47'),
        ('71000000-0000-0000-0000-000000000011'::uuid, '70000000-0000-0000-0000-000000000005'::uuid, 'DV001', '47', 1, 1200000::numeric, 0::numeric, 'Điều trị tủy răng 47'),
        ('71000000-0000-0000-0000-000000000012'::uuid, '70000000-0000-0000-0000-000000000005'::uuid, 'DV003', '47', 1, 300000::numeric, 0::numeric, 'Định vị chóp răng 47'),
        ('71000000-0000-0000-0000-000000000013'::uuid, '70000000-0000-0000-0000-000000000006'::uuid, 'DV006', NULL, 1, 25000000::numeric, 0::numeric, 'Liệu trình chỉnh nha'),
        ('71000000-0000-0000-0000-000000000014'::uuid, '70000000-0000-0000-0000-000000000006'::uuid, 'DV002', NULL, 1, 150000::numeric, 0::numeric, 'Chụp phim chỉnh nha')
)
INSERT INTO treatment_services (id, treatment_id, service_id, service_name, quantity, unit_price, tooth_code, discount_amount, subtotal, note)
SELECT ts.id, ts.treatment_id, s.id, s.name, ts.quantity, ts.unit_price, ts.tooth_code, ts.discount_amount, ts.quantity * ts.unit_price - ts.discount_amount, ts.note
FROM seed_treatment_services ts
JOIN services s ON s.code = ts.service_code
ON CONFLICT (id) DO UPDATE
SET treatment_id = EXCLUDED.treatment_id,
    service_id = EXCLUDED.service_id,
    service_name = EXCLUDED.service_name,
    quantity = EXCLUDED.quantity,
    unit_price = EXCLUDED.unit_price,
    tooth_code = EXCLUDED.tooth_code,
    discount_amount = EXCLUDED.discount_amount,
    subtotal = EXCLUDED.subtotal,
    note = EXCLUDED.note;

WITH seed_sessions(id, treatment_id, appointment_id, session_date, procedure_performed, doctor_note, patient_response, next_appointment_date, note) AS (
    VALUES
        ('72000000-0000-0000-0000-000000000001'::uuid, '70000000-0000-0000-0000-000000000001'::uuid, '60000000-0000-0000-0000-000000000001'::uuid, TIMESTAMP '2026-06-05 08:00', 'Chụp phim, gây tê, mở tủy và làm sạch ống tủy bước đầu.', 'Bệnh nhân hợp tác tốt.', 'Còn ê nhẹ sau điều trị.', DATE '2026-06-12', 'completed'),
        ('72000000-0000-0000-0000-000000000002'::uuid, '70000000-0000-0000-0000-000000000005'::uuid, '60000000-0000-0000-0000-000000000005'::uuid, TIMESTAMP '2026-06-07 10:00', 'Khám, chụp phim, đánh giá khả năng bảo tồn răng 47.', 'Cần kiểm tra đường huyết trước can thiệp tiếp theo.', 'Đau giảm sau khi dùng thuốc.', DATE '2026-06-14', 'completed'),
        ('72000000-0000-0000-0000-000000000003'::uuid, '70000000-0000-0000-0000-000000000004'::uuid, '60000000-0000-0000-0000-000000000004'::uuid, TIMESTAMP '2026-06-07 08:30', 'Lấy cao răng và tư vấn thẩm mỹ răng cửa.', 'Tư vấn phương án thẩm mỹ răng.', 'Hài lòng sau tư vấn.', NULL, 'completed')
)
INSERT INTO treatment_sessions (id, treatment_id, appointment_id, session_date, procedure_performed, doctor_note, patient_response, next_appointment_date, note)
SELECT * FROM seed_sessions
ON CONFLICT (id) DO UPDATE
SET treatment_id = EXCLUDED.treatment_id,
    appointment_id = EXCLUDED.appointment_id,
    session_date = EXCLUDED.session_date,
    procedure_performed = EXCLUDED.procedure_performed,
    doctor_note = EXCLUDED.doctor_note,
    patient_response = EXCLUDED.patient_response,
    next_appointment_date = EXCLUDED.next_appointment_date,
    note = EXCLUDED.note,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_prescriptions(id, treatment_id, note) AS (
    VALUES
        ('80000000-0000-0000-0000-000000000001'::uuid, '70000000-0000-0000-0000-000000000001'::uuid, 'Chẩn đoán: Viêm tủy răng 36. Dùng thuốc sau điều trị tủy nếu đau.'),
        ('80000000-0000-0000-0000-000000000002'::uuid, '70000000-0000-0000-0000-000000000005'::uuid, 'Chẩn đoán: Sâu răng 47 nghi viêm tủy. Lưu ý bệnh nhân có tiểu đường.'),
        ('80000000-0000-0000-0000-000000000003'::uuid, '70000000-0000-0000-0000-000000000002'::uuid, 'Không kê Amoxicillin vì bệnh nhân dị ứng Penicillin. Có thể dùng Paracetamol 500mg nếu đau.')
)
INSERT INTO prescriptions (id, treatment_id, note, created_at)
SELECT id, treatment_id, note, TIMESTAMP '2026-06-05 11:00'
FROM seed_prescriptions
ON CONFLICT (id) DO UPDATE
SET treatment_id = EXCLUDED.treatment_id,
    note = EXCLUDED.note;

WITH seed_items(id, prescription_id, medicine_id, quantity, dosage) AS (
    VALUES
        ('81000000-0000-0000-0000-000000000001'::uuid, '80000000-0000-0000-0000-000000000001'::uuid, '40000000-0000-0000-0000-000000000002'::uuid, 6, '1 viên, 2 lần/ngày, 3 ngày. Uống sau ăn khi đau.'),
        ('81000000-0000-0000-0000-000000000002'::uuid, '80000000-0000-0000-0000-000000000001'::uuid, '40000000-0000-0000-0000-000000000003'::uuid, 6, '1 viên, 2 lần/ngày, 3 ngày. Uống khi đau, không quá liều.'),
        ('81000000-0000-0000-0000-000000000003'::uuid, '80000000-0000-0000-0000-000000000002'::uuid, '40000000-0000-0000-0000-000000000004'::uuid, 10, '1 viên, 2 lần/ngày, 5 ngày. Uống sau ăn.'),
        ('81000000-0000-0000-0000-000000000004'::uuid, '80000000-0000-0000-0000-000000000002'::uuid, '40000000-0000-0000-0000-000000000002'::uuid, 6, '1 viên, 2 lần/ngày, 3 ngày. Uống sau ăn khi đau.'),
        ('81000000-0000-0000-0000-000000000005'::uuid, '80000000-0000-0000-0000-000000000003'::uuid, '40000000-0000-0000-0000-000000000003'::uuid, 4, '1 viên, 2 lần/ngày, 2 ngày. Uống khi đau.')
)
INSERT INTO prescription_items (id, prescription_id, medicine_id, quantity, dosage)
SELECT i.id, i.prescription_id, i.medicine_id, i.quantity, i.dosage
FROM seed_items i
ON CONFLICT (id) DO UPDATE
SET prescription_id = EXCLUDED.prescription_id,
    medicine_id = EXCLUDED.medicine_id,
    quantity = EXCLUDED.quantity,
    dosage = EXCLUDED.dosage;

WITH seed_invoices(id, invoice_code, treatment_id, patient_id, total_amount, discount_amount, final_amount, paid_amount, remaining_amount, status, issued_by_email, note, created_at) AS (
    VALUES
        ('90000000-0000-0000-0000-000000000001'::uuid, 'HD20260605001', '70000000-0000-0000-0000-000000000001'::uuid, '50000000-0000-0000-0000-000000000001'::uuid, 1650000::numeric, 50000::numeric, 1600000::numeric, 800000::numeric, 800000::numeric, 'partial', 'receptionist@clinic.com', 'Thanh toán một phần sau buổi điều trị đầu tiên.', TIMESTAMP '2026-06-05 10:00'),
        ('90000000-0000-0000-0000-000000000002'::uuid, 'HD20260607001', '70000000-0000-0000-0000-000000000004'::uuid, '50000000-0000-0000-0000-000000000004'::uuid, 5300000::numeric, 300000::numeric, 5000000::numeric, 5000000::numeric, 0::numeric, 'paid', 'receptionist@clinic.com', 'Đã thanh toán đủ.', TIMESTAMP '2026-06-07 10:00'),
        ('90000000-0000-0000-0000-000000000003'::uuid, 'HD20260605002', '70000000-0000-0000-0000-000000000002'::uuid, '50000000-0000-0000-0000-000000000002'::uuid, 150000::numeric, 0::numeric, 150000::numeric, 0::numeric, 150000::numeric, 'unpaid', 'receptionist@clinic.com', 'Chưa thanh toán.', TIMESTAMP '2026-06-05 10:30'),
        ('90000000-0000-0000-0000-000000000004'::uuid, 'HD20260607002', '70000000-0000-0000-0000-000000000005'::uuid, '50000000-0000-0000-0000-000000000005'::uuid, 1650000::numeric, 0::numeric, 1650000::numeric, 1650000::numeric, 0::numeric, 'paid', 'receptionist@clinic.com', 'Đã thanh toán đủ.', TIMESTAMP '2026-06-07 11:30'),
        ('90000000-0000-0000-0000-000000000005'::uuid, 'HD20260606001', '70000000-0000-0000-0000-000000000003'::uuid, '50000000-0000-0000-0000-000000000003'::uuid, 15150000::numeric, 150000::numeric, 15000000::numeric, 0::numeric, 15000000::numeric, 'unpaid', 'receptionist@clinic.com', 'Tư vấn Implant, chưa thanh toán.', TIMESTAMP '2026-06-06 15:15')
)
INSERT INTO invoices (id, invoice_code, treatment_id, patient_id, total_amount, discount_amount, final_amount, paid_amount, remaining_amount, status, issued_by, note, created_at)
SELECT i.id, i.invoice_code, i.treatment_id, i.patient_id, i.total_amount, i.discount_amount, i.final_amount, i.paid_amount, i.remaining_amount, i.status, u.id, i.note, i.created_at
FROM seed_invoices i
JOIN users u ON u.email = i.issued_by_email
ON CONFLICT (invoice_code) DO UPDATE
SET treatment_id = EXCLUDED.treatment_id,
    patient_id = EXCLUDED.patient_id,
    total_amount = EXCLUDED.total_amount,
    discount_amount = EXCLUDED.discount_amount,
    final_amount = EXCLUDED.final_amount,
    paid_amount = EXCLUDED.paid_amount,
    remaining_amount = EXCLUDED.remaining_amount,
    status = EXCLUDED.status,
    issued_by = EXCLUDED.issued_by,
    note = EXCLUDED.note,
    created_at = EXCLUDED.created_at,
    updated_at = CURRENT_TIMESTAMP;

WITH seed_payments(id, payment_code, invoice_code, amount, method, transaction_code, status, received_by_email, note, paid_at) AS (
    VALUES
        ('91000000-0000-0000-0000-000000000001'::uuid, 'PT20260605001', 'HD20260605001', 800000::numeric, 'cash', NULL, 'success', 'receptionist@clinic.com', 'Thanh toán tiền mặt lần 1.', TIMESTAMP '2026-06-05 10:05'),
        ('91000000-0000-0000-0000-000000000002'::uuid, 'PT20260607001', 'HD20260607001', 3000000::numeric, 'transfer', 'TCB202606070001', 'success', 'receptionist@clinic.com', 'Chuyển khoản lần 1.', TIMESTAMP '2026-06-07 10:05'),
        ('91000000-0000-0000-0000-000000000003'::uuid, 'PT20260607002', 'HD20260607001', 2000000::numeric, 'cash', NULL, 'success', 'receptionist@clinic.com', 'Thanh toán phần còn lại.', TIMESTAMP '2026-06-07 10:15'),
        ('91000000-0000-0000-0000-000000000004'::uuid, 'PT20260607003', 'HD20260607002', 1650000::numeric, 'card', 'CARD202606070003', 'success', 'receptionist@clinic.com', 'Thanh toán bằng thẻ.', TIMESTAMP '2026-06-07 11:35')
)
INSERT INTO payments (id, payment_code, invoice_id, amount, method, transaction_code, status, received_by, note, paid_at, created_at)
SELECT p.id, p.payment_code, i.id, p.amount, p.method, p.transaction_code, p.status, u.id, p.note, p.paid_at, p.paid_at
FROM seed_payments p
JOIN invoices i ON i.invoice_code = p.invoice_code
JOIN users u ON u.email = p.received_by_email
ON CONFLICT (payment_code) DO UPDATE
SET invoice_id = EXCLUDED.invoice_id,
    amount = EXCLUDED.amount,
    method = EXCLUDED.method,
    transaction_code = EXCLUDED.transaction_code,
    status = EXCLUDED.status,
    received_by = EXCLUDED.received_by,
    note = EXCLUDED.note,
    paid_at = EXCLUDED.paid_at,
    created_at = EXCLUDED.created_at;

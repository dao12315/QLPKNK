-- USERS
INSERT INTO users (name, email, password, role)
VALUES
    ('Admin', 'admin@gmail.com', '123456', 'admin'),
    ('Lễ tân', 'reception@gmail.com', '123456', 'receptionist'),
    ('Bác sĩ A', 'doctor@gmail.com', '123456', 'dentist');

-- DOCTOR
INSERT INTO doctors (user_id, specialization, experience_years)
VALUES (3, 'Orthodontics', 5);

-- CHAIRS
INSERT INTO chairs (name) VALUES ('Chair 1'), ('Chair 2');

-- TEETH (FDI)
INSERT INTO teeth(code) VALUES
                            ('11'),('12'),('13'),('14'),('15'),('16'),('17'),('18'),
                            ('21'),('22'),('23'),('24'),('25'),('26'),('27'),('28');

-- SERVICES
INSERT INTO services (name, price, duration_minutes)
VALUES
    ('Khám tổng quát', 100000, 30),
    ('Nhổ răng', 300000, 45),
    ('Trám răng', 200000, 30);
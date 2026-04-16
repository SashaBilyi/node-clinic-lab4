
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL
);


CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);


CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER REFERENCES schedules(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    is_cancelled BOOLEAN DEFAULT FALSE
);


INSERT INTO doctors (name, specialty) VALUES 
('Коваленко Іван Петрович', 'Терапевт'),
('Мельник Олена Василівна', 'Кардіолог'),
('Шевченко Андрій Миколайович', 'Хірург');


INSERT INTO schedules (doctor_id, date, time, is_booked) VALUES 
(1, '2026-05-10', '09:00:00', FALSE),
(1, '2026-05-10', '09:30:00', FALSE),
(1, '2026-05-10', '10:00:00', TRUE),
(2, '2026-05-11', '14:00:00', FALSE),
(2, '2026-05-11', '14:30:00', TRUE),
(3, '2026-05-12', '11:00:00', FALSE);


INSERT INTO bookings (schedule_id, patient_name, doctor_name, appointment_date, appointment_time) VALUES 
(3, 'Олександр Марченко', 'Коваленко Іван Петрович', '2026-05-10', '10:00:00'),
(5, 'Ірина Бойко', 'Мельник Олена Василівна', '2026-05-11', '14:30:00');
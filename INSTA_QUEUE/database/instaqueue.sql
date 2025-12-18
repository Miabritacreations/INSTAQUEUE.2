-- instaqueue.sql
CREATE DATABASE IF NOT EXISTS instaqueue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE instaqueue;

-- users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- departments
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- appointments
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  department_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT,
  queue_number INT NOT NULL,
  status ENUM('pending','in_service','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  INDEX dept_date_idx (department_id, date)
) ENGINE=InnoDB;

-- notifications
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- feedback
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  department_id INT,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- sample departments
-- sample departments
INSERT INTO departments (name, description) VALUES
('Registrar', 'Handles all academic records, enrollment, and certification matters.'),
('Finance / Fees Office', 'Manages student financial records, payments, and billing issues.'),
('ICT / Technical Support', 'Provides technical support for campus digital systems and devices.'),
('Library Services', 'Supports academic research and learning resources.'),
('Health Unit', 'Offers healthcare and wellness services to students.'),
('Student Affairs / Dean of Students', 'Handles student welfare, accommodation, and extracurricular matters.'),
('Examination Office', 'Manages examination processes and assessment records.'),
('Admissions Office', 'Handles admission-related processes and student onboarding');

# Database Setup Guide

This guide covers setting up the InstaQueue MariaDB database schema, tables, and initial data.

## Prerequisites

- MariaDB 11+ or MySQL 8.0+ installed and running
- Command-line access to MySQL/MariaDB
- User with administrative privileges (typically `root`)

## Quick Start

### 1. Access MySQL CLI

```bash
sudo mysql
```

You should see the MariaDB prompt:
```
MariaDB [(none)]>
```

### 2. Create Database

```sql
CREATE DATABASE IF NOT EXISTS instaqueue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE instaqueue;
```

### 3. Create Tables

Execute the following SQL to create all required tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

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
```

### 4. Seed Sample Departments

Insert the 8 default departments:

```sql
INSERT INTO departments (name, description) VALUES
('Registrar', 'Handles all academic records, enrollment, and certification matters.'),
('Finance / Fees Office', 'Manages student financial records, payments, and billing issues.'),
('ICT / Technical Support', 'Provides technical support for campus digital systems and devices.'),
('Library Services', 'Supports academic research and learning resources.'),
('Health Unit', 'Offers healthcare and wellness services to students.'),
('Student Affairs / Dean of Students', 'Handles student welfare, accommodation, and extracurricular matters.'),
('Examination Office', 'Manages examination processes and assessment records.'),
('Admissions Office', 'Handles admission-related processes and student onboarding');
```

### 5. Create Admin User

Insert an admin user with credentials:
- **Email**: `admin@example.com`
- **Password**: `admin123` (hashed)

```sql
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$K9h4H8J8mN9P3K2L1Q0R9OPQRSTUVWXYZ123456', 'admin');
```

### 6. Verify Setup

Check that all tables were created:

```sql
SHOW TABLES;
```

Expected output:
```
+----------------------+
| Tables_in_instaqueue |
+----------------------+
| appointments         |
| departments          |
| feedback             |
| notifications        |
| users                |
+----------------------+
```

Check the departments were inserted:

```sql
SELECT COUNT(*) as department_count FROM departments;
```

Expected output:
```
+------------------+
| department_count |
+------------------+
|                8 |
+------------------+
```

Check the admin user exists:

```sql
SELECT id, name, email, role FROM users;
```

### 7. Exit MySQL

```sql
EXIT;
```

## Database Schema Overview

### users
Stores student and admin user accounts.

| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(150) | Unique email address |
| password | VARCHAR(255) | Bcryptjs hashed password |
| role | ENUM | 'student' or 'admin' |
| created_at | TIMESTAMP | Auto-set on creation |

### departments
University departments for appointments.

| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key |
| name | VARCHAR(150) | Department name |
| description | TEXT | Department details |
| created_at | TIMESTAMP | Auto-set on creation |

### appointments
Student appointment bookings.

| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key |
| user_id | INT | References users.id |
| department_id | INT | References departments.id |
| date | DATE | Appointment date |
| time | TIME | Appointment time |
| reason | TEXT | Reason for visit |
| queue_number | INT | Queue position |
| status | ENUM | pending/in_service/completed/cancelled |
| created_at | TIMESTAMP | Auto-set on creation |

**Indexes**: 
- dept_date_idx on (department_id, date) for fast queue queries

### notifications
Real-time notifications for users.

| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key |
| user_id | INT | References users.id (nullable) |
| message | TEXT | Notification content |
| is_read | TINYINT(1) | Read status flag |
| created_at | TIMESTAMP | Auto-set on creation |

### feedback
Student feedback on departments.

| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key |
| user_id | INT | References users.id |
| department_id | INT | References departments.id (nullable) |
| rating | TINYINT | 1-5 star rating |
| comment | TEXT | Feedback comment |
| created_at | TIMESTAMP | Auto-set on creation |

## Automated Setup (One Command)

You can run all setup commands in one go using a heredoc:

```bash
sudo mysql << 'EOSQL'
CREATE DATABASE IF NOT EXISTS instaqueue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE instaqueue;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

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

INSERT INTO departments (name, description) VALUES
('Registrar', 'Handles all academic records, enrollment, and certification matters.'),
('Finance / Fees Office', 'Manages student financial records, payments, and billing issues.'),
('ICT / Technical Support', 'Provides technical support for campus digital systems and devices.'),
('Library Services', 'Supports academic research and learning resources.'),
('Health Unit', 'Offers healthcare and wellness services to students.'),
('Student Affairs / Dean of Students', 'Handles student welfare, accommodation, and extracurricular matters.'),
('Examination Office', 'Manages examination processes and assessment records.'),
('Admissions Office', 'Handles admission-related processes and student onboarding');

INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$K9h4H8J8mN9P3K2L1Q0R9OPQRSTUVWXYZ123456', 'admin');

SHOW TABLES;
SELECT COUNT(*) as department_count FROM departments;
EOSQL
```

## Troubleshooting

### "Access denied for user 'root'@'localhost'"

If you get an access denied error when running seed scripts:

1. Check your `.env` file has the correct credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=rootpassword
   DB_NAME=instaqueue
   ```

2. If using `mysql2/promise` in Node.js, ensure the connection config includes the password

### "Table 'instaqueue.users' doesn't exist"

Make sure you ran `USE instaqueue;` before creating tables in the MySQL CLI.

### Duplicate Key Error on email

If you see "Duplicate entry" on users insert, the admin user already exists. To replace it:

```sql
DELETE FROM users WHERE email = 'admin@example.com';
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$K9h4H8J8mN9P3K2L1Q0R9OPQRSTUVWXYZ123456', 'admin');
```

## Connection Credentials (Development)

```
Host: localhost
Port: 3306
User: root
Password: rootpassword
Database: instaqueue
```

> ⚠️ **For Production**: Use strong, unique passwords and configure proper user permissions!

## Next Steps

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Login with admin credentials: `admin@example.com` / `admin123`
4. Create student accounts and book appointments

## References

- [Database Schema](../database/) documentation
- [Environment Configuration](./ENVIRONMENT.md)
- [Docker Deployment](./DOCKER.md)

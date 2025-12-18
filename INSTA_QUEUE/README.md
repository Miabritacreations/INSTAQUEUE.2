# InstaQueue

Smart Campus Queue & Appointment Management — XAMPP (Apache + MySQL)

Quick start

Option A — XAMPP

1. Copy the `INSTA_QUEUE` folder into your XAMPP `htdocs` directory.
2. Start Apache and MySQL via XAMPP Control Panel.
3. Create the database and tables:
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import `database/instaqueue.sql` (creates `instaqueue` schema and tables).
4. Seed initial data and admin account (runs PHP to hash password):
   - From a terminal: `php backend/seed.php`
5. Open app in browser: http://localhost/INSTA_QUEUE/index.html

Option B — Docker (recommended, single command)

1. Install Docker and Docker Compose.
2. From the repository root run:

```bash
docker-compose up --build -d
```

3. The frontend/PHP will be available at: http://localhost:8000
   - MySQL is exposed on port 3306 (root/rootpassword).
   - The SQL schema in `INSTA_QUEUE/database/instaqueue.sql` is automatically imported on first DB start.
4. Seed the admin user (run inside the web container):

```bash
docker-compose exec web php backend/seed.php
```

5. Open the app: http://localhost:8000

Admin credentials (after running seed script):
- Email: admin@example.com
- Password: admin123

Files
- index.html — Landing / links
- login.html / register.html — auth pages
- dashboard-student.html / dashboard-admin.html — role pages
- feedback.html — submit feedback
- css/style.css — styles (glassmorphism)
- js/script.js — frontend logic + AJAX
- backend/*.php — PHP API (config, auth, departments, appointments, notifications, reports)
- database/instaqueue.sql — DB schema (use phpMyAdmin)

Security
- Passwords hashed with `password_hash()` in `backend/seed.php` and `backend/auth.php`.
- Prepared statements (PDO) used for all DB queries.
- Role-based access enforced in backend endpoints.

If anything fails, check Apache error log and ensure `pdo_mysql` is enabled in PHP.

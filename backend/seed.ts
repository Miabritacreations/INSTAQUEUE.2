import { pool } from './src/config/database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const connection = await pool.getConnection();
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@example.com', hashedPassword, 'admin']
    );

    // Create sample departments (if not exists)
    const departments = [
      { name: 'Registrar', description: 'Handles all academic records, enrollment, and certification matters.' },
      { name: 'Finance / Fees Office', description: 'Manages student financial records, payments, and billing issues.' },
      { name: 'ICT / Technical Support', description: 'Provides technical support for campus digital systems and devices.' },
      { name: 'Library Services', description: 'Supports academic research and learning resources.' },
      { name: 'Health Unit', description: 'Offers healthcare and wellness services to students.' },
      { name: 'Student Affairs / Dean of Students', description: 'Handles student welfare, accommodation, and extracurricular matters.' },
      { name: 'Examination Office', description: 'Manages examination processes and assessment records.' },
      { name: 'Admissions Office', description: 'Handles admission-related processes and student onboarding.' },
    ];

    for (const dept of departments) {
      await connection.query(
        'INSERT IGNORE INTO departments (name, description) VALUES (?, ?)',
        [dept.name, dept.description]
      );
    }

    console.log('✅ Database seeded successfully!');
    console.log('Admin credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    connection.release();
    process.exit(0);
  }
}

seed();

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { User, JWTPayload } from '../types';

export class AuthService {
  static async register(name: string, email: string, password: string): Promise<User> {
    const connection = await pool.getConnection();
    try {
      // Check if user exists
      const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
      if ((existingUser as any[]).length > 0) {
        throw new Error('Email already in use');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
        name,
        email,
        hashedPassword,
        'student',
      ]);

      const [newUser] = await connection.query('SELECT id, name, email, role, created_at FROM users WHERE email = ?', [email]);
      return (newUser as User[])[0];
    } finally {
      connection.release();
    }
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query('SELECT id, name, email, password, role, created_at FROM users WHERE email = ?', [email]);

      if ((users as any[]).length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = (users as any[])[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role } as JWTPayload, process.env.JWT_SECRET || 'secret', {
        expiresIn: '24h',
      });

      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } finally {
      connection.release();
    }
  }

  static async getUserById(id: number): Promise<User | null> {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT id, name, email, phone, department, year, student_id, role, created_at FROM users WHERE id = ?', 
        [id]
      );
      return (users as User[])[0] || null;
    } finally {
      connection.release();
    }
  }

  static async updateProfile(id: number, data: {
    name: string;
    email: string;
    phone?: string;
    department?: string;
    year?: string;
  }): Promise<User> {
    const connection = await pool.getConnection();
    try {
      // Check if email is already in use by another user
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [data.email, id]
      );
      
      if ((existingUser as any[]).length > 0) {
        throw new Error('Email already in use');
      }

      // Update user
      await connection.query(
        `UPDATE users 
         SET name = ?, email = ?, phone = ?, department = ?, year = ? 
         WHERE id = ?`,
        [data.name, data.email, data.phone || null, data.department || null, data.year || null, id]
      );

      // Get updated user
      const [users] = await connection.query(
        'SELECT id, name, email, phone, department, year, student_id, role, created_at FROM users WHERE id = ?',
        [id]
      );
      
      return (users as User[])[0];
    } finally {
      connection.release();
    }
  }
}

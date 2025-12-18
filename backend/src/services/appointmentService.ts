import { pool } from '../config/database';
import { redisClient } from '../config/redis';
import { Appointment } from '../types';

export class AppointmentService {
  static async createAppointment(
    userId: number,
    departmentId: number,
    date: string,
    time: string,
    reason: string
  ): Promise<Appointment> {
    const connection = await pool.getConnection();
    try {
      // Get next queue number
      const [maxResult] = await connection.query(
        'SELECT MAX(queue_number) as maxq FROM appointments WHERE department_id = ? AND date = ?',
        [departmentId, date]
      );

      const nextNumber = ((maxResult as any[])[0].maxq || 0) + 1;

      // Insert appointment
      const [result] = await connection.query(
        'INSERT INTO appointments (user_id, department_id, date, time, reason, queue_number, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, departmentId, date, time, reason, nextNumber, 'pending']
      );

      // Invalidate cache for this department/date
      await redisClient.del(`queue:${departmentId}:${date}`);

      const appointment = await this.getAppointmentById((result as any).insertId);
      return appointment!;
    } finally {
      connection.release();
    }
  }

  static async getAppointmentById(id: number): Promise<Appointment | null> {
    const connection = await pool.getConnection();
    try {
      const [appointments] = await connection.query(
        `SELECT a.*, u.name as student_name, d.name as department 
         FROM appointments a 
         LEFT JOIN users u ON u.id = a.user_id 
         JOIN departments d ON d.id = a.department_id 
         WHERE a.id = ?`,
        [id]
      );

      return (appointments as Appointment[])[0] || null;
    } finally {
      connection.release();
    }
  }

  static async getUserAppointments(userId: number): Promise<Appointment[]> {
    const connection = await pool.getConnection();
    try {
      const [appointments] = await connection.query(
        `SELECT a.*, d.name as department 
         FROM appointments a 
         JOIN departments d ON d.id = a.department_id 
         WHERE a.user_id = ? 
         ORDER BY a.date DESC, a.time DESC`,
        [userId]
      );

      return appointments as Appointment[];
    } finally {
      connection.release();
    }
  }

  static async getTodayQueueByDepartment(departmentId: number): Promise<Appointment[]> {
    const connection = await pool.getConnection();
    try {
      const today = new Date().toISOString().split('T')[0];

      // Try cache first
      const cacheKey = `queue:${departmentId}:${today}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const [appointments] = await connection.query(
        `SELECT a.*, u.name as student_name, d.name as department 
         FROM appointments a 
         JOIN users u ON u.id = a.user_id 
         JOIN departments d ON d.id = a.department_id 
         WHERE a.department_id = ? AND a.date = ? 
         ORDER BY a.queue_number ASC`,
        [departmentId, today]
      );

      // Cache for 5 minutes
      await redisClient.setEx(cacheKey, 300, JSON.stringify(appointments));

      return appointments as Appointment[];
    } finally {
      connection.release();
    }
  }

  static async getNextPendingAppointment(departmentId: number): Promise<Appointment | null> {
    const connection = await pool.getConnection();
    try {
      const today = new Date().toISOString().split('T')[0];

      const [appointments] = await connection.query(
        `SELECT a.*, u.name as student_name, d.name as department 
         FROM appointments a 
         LEFT JOIN users u ON u.id = a.user_id 
         JOIN departments d ON d.id = a.department_id 
         WHERE a.department_id = ? AND a.date = ? AND a.status = 'pending' 
         ORDER BY a.queue_number ASC 
         LIMIT 1`,
        [departmentId, today]
      );

      return (appointments as Appointment[])[0] || null;
    } finally {
      connection.release();
    }
  }

  static async updateAppointmentStatus(id: number, status: string): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);

      // Invalidate relevant caches
      const appointment = await this.getAppointmentById(id);
      if (appointment) {
        await redisClient.del(`queue:${appointment.department_id}:${appointment.date}`);
      }

      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async cancelAppointment(id: number): Promise<boolean> {
    return this.updateAppointmentStatus(id, 'cancelled');
  }

  static async getUserStats(userId: number): Promise<any> {
    const connection = await pool.getConnection();
    try {
      // Get total appointments count
      const [totalResult] = await connection.query(
        'SELECT COUNT(*) as total FROM appointments WHERE user_id = ?',
        [userId]
      );
      const total = (totalResult as any[])[0].total;

      // Get pending appointments count
      const [pendingResult] = await connection.query(
        'SELECT COUNT(*) as pending FROM appointments WHERE user_id = ? AND status = ?',
        [userId, 'pending']
      );
      const pending = (pendingResult as any[])[0].pending;

      // Get completed appointments count
      const [completedResult] = await connection.query(
        'SELECT COUNT(*) as completed FROM appointments WHERE user_id = ? AND status = ?',
        [userId, 'completed']
      );
      const completed = (completedResult as any[])[0].completed;

      // Get confirmed appointments count
      const [confirmedResult] = await connection.query(
        'SELECT COUNT(*) as confirmed FROM appointments WHERE user_id = ? AND status = ?',
        [userId, 'confirmed']
      );
      const confirmed = (confirmedResult as any[])[0].confirmed;

      // Get upcoming appointments (next 7 days)
      const [upcomingResult] = await connection.query(
        `SELECT COUNT(*) as upcoming FROM appointments 
         WHERE user_id = ? AND status IN ('pending', 'confirmed') 
         AND date >= CURDATE() AND date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
        [userId]
      );
      const upcoming = (upcomingResult as any[])[0].upcoming;

      // Get recent appointments (last 5)
      const [recentAppointments] = await connection.query(
        `SELECT a.*, d.name as department 
         FROM appointments a 
         JOIN departments d ON d.id = a.department_id 
         WHERE a.user_id = ? 
         ORDER BY a.created_at DESC 
         LIMIT 5`,
        [userId]
      );

      // Get next appointment
      const [nextAppointment] = await connection.query(
        `SELECT a.*, d.name as department 
         FROM appointments a 
         JOIN departments d ON d.id = a.department_id 
         WHERE a.user_id = ? AND status IN ('pending', 'confirmed') 
         AND (date > CURDATE() OR (date = CURDATE() AND time >= CURTIME()))
         ORDER BY a.date ASC, a.time ASC 
         LIMIT 1`,
        [userId]
      );

      return {
        total,
        pending,
        completed,
        confirmed,
        upcoming,
        recentAppointments,
        nextAppointment: (nextAppointment as any[])[0] || null
      };
    } finally {
      connection.release();
    }
  }
}

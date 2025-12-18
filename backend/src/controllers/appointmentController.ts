import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';

export class AppointmentController {
  static async createAppointment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { department_id, date, time, reason } = req.body;

      if (!department_id || !date || !time) {
        return res.status(400).json({ error: 'Missing fields' });
      }

      const appointment = await AppointmentService.createAppointment(req.user.id, department_id, date, time, reason || '');
      res.status(201).json({ success: true, appointment });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserAppointments(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const appointments = await AppointmentService.getUserAppointments(req.user.id);
      res.json({ appointments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTodayQueue(req: Request, res: Response) {
    try {
      const { department_id } = req.query;

      if (!department_id) {
        return res.status(400).json({ error: 'Missing department_id' });
      }

      const queue = await AppointmentService.getTodayQueueByDepartment(parseInt(department_id as string));
      res.json({ queue });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getNextAppointment(req: Request, res: Response) {
    try {
      const { department_id } = req.query;

      if (!department_id) {
        return res.status(400).json({ error: 'Missing department_id' });
      }

      const appointment = await AppointmentService.getNextPendingAppointment(parseInt(department_id as string));
      res.json({ appointment });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'Missing fields' });
      }

      await AppointmentService.updateAppointmentStatus(id, status);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cancelAppointment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Missing id' });
      }

      await AppointmentService.cancelAppointment(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

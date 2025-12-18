import { Router } from 'express';
import { pool } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { Request, Response } from 'express';

const router = Router();

router.use(authMiddleware);

// Get user's notifications
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const connection = await pool.getConnection();
    try {
      const [notifications] = await connection.query(
        `SELECT * FROM notifications 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [req.user.id]
      );

      res.json({ notifications });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get unread notifications count
router.get('/unread-count', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `SELECT COUNT(*) as count FROM notifications 
         WHERE user_id = ? AND is_read = FALSE`,
        [req.user.id]
      );

      res.json({ count: (result as any[])[0].count });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
        [id, req.user.id]
      );

      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.query(
        'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
        [req.user.id]
      );

      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create notification (internal use or admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { user_id, type, title, message } = req.body;

    if (!user_id || !type || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.query(
        'INSERT INTO notifications (user_id, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, FALSE, NOW())',
        [user_id, type, title, message]
      );

      res.status(201).json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [id, req.user.id]
      );

      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

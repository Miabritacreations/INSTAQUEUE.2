import { Router } from 'express';
import { pool } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { Request, Response } from 'express';

const router = Router();

router.use(authMiddleware);

// Submit feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { department_id, rating, experience, suggestions } = req.body;

    if (!department_id || !rating || !experience) {
      return res.status(400).json({ error: 'Department, rating, and experience are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.query(
        'INSERT INTO feedback (user_id, department_id, rating, experience, suggestions, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [req.user.id, department_id, rating, experience, suggestions || '']
      );

      res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's feedback history
router.get('/mine', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const connection = await pool.getConnection();
    try {
      const [feedback] = await connection.query(
        `SELECT f.*, d.name as department 
         FROM feedback f 
         JOIN departments d ON d.id = f.department_id 
         WHERE f.user_id = ? 
         ORDER BY f.created_at DESC`,
        [req.user.id]
      );

      res.json({ feedback });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all feedback (admin only)
router.get('/all', async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const connection = await pool.getConnection();
    try {
      const [feedback] = await connection.query(
        `SELECT f.*, u.name as user_name, d.name as department 
         FROM feedback f 
         JOIN users u ON u.id = f.user_id 
         JOIN departments d ON d.id = f.department_id 
         ORDER BY f.created_at DESC`
      );

      res.json({ feedback });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get feedback stats by department (admin only)
router.get('/stats/:department_id', async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { department_id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [stats] = await connection.query(
        `SELECT 
          COUNT(*) as total_feedback,
          AVG(rating) as average_rating,
          SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
          SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
          SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
          SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
          SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
         FROM feedback 
         WHERE department_id = ?`,
        [department_id]
      );

      res.json({ stats: (stats as any[])[0] });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import { Router } from 'express';
import { pool } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { Request, Response } from 'express';

const router = Router();

// Get all departments
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [departments] = await connection.query(
        'SELECT id, name, description FROM departments ORDER BY name ASC'
      );
      res.json({ departments });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get department by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [departments] = await connection.query(
        'SELECT id, name, description FROM departments WHERE id = ?',
        [id]
      );
      
      if ((departments as any[]).length === 0) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      res.json({ department: (departments as any[])[0] });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

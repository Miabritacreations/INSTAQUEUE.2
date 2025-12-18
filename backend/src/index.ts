import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth';
import appointmentRoutes from './routes/appointments';
import { authMiddleware } from './middleware/auth';
import { redisClient } from './config/redis';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Redis
redisClient.connect();

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', authMiddleware, appointmentRoutes);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join department room for real-time queue updates
  socket.on('join-queue', (departmentId: number) => {
    socket.join(`queue-${departmentId}`);
    console.log(`Client ${socket.id} joined queue-${departmentId}`);
  });

  // Leave department room
  socket.on('leave-queue', (departmentId: number) => {
    socket.leave(`queue-${departmentId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in other parts of the app
export { io };

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

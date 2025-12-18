import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', AppointmentController.createAppointment);
router.get('/mine', AppointmentController.getUserAppointments);
router.get('/queue', AppointmentController.getTodayQueue);
router.get('/next', AppointmentController.getNextAppointment);
router.put('/status', AppointmentController.updateStatus);
router.put('/cancel', AppointmentController.cancelAppointment);

export default router;

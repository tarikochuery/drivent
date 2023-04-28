import { Router } from 'express';
import { getBooking } from '@/controllers/booking-controller';
import { authenticateToken } from '@/middlewares';

export const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBooking).post('/').put('/:bookingId');

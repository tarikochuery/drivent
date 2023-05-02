import { Router } from 'express';
import { createBooking, getBooking, updateBooking } from '@/controllers/booking-controller';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { bookingParams, bookingSchema } from '@/schemas';

export const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', validateBody(bookingSchema), validateParams(bookingParams), updateBooking);

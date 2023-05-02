import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);
    return res.send(booking);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const roomId = req.body.roomId as number;

  try {
    const bookingData = await bookingService.createBooking({ userId, roomId });
    return res.send(bookingData);
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const roomId = req.body.roomId as number;
  const bookingId = req.params.bookingId as string;

  try {
    const bookingData = await bookingService.updateBooking({
      userId,
      roomId,
      bookingId: Number(bookingId),
    });
    return res.send(bookingData);
  } catch (error) {
    next(error);
  }
}

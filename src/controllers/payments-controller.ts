import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payments-service';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = req.query.ticketId as string;

  try {
    const payment = await paymentService.getPaymentByTicketId({
      ticketId: Number(ticketId),
      userId,
    });

    return res.send(payment);
  } catch (error) {
    console.log(error);
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === 'RequestError') {
      return res.status(error.status).send(error.message);
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

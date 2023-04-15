import httpStatus from 'http-status';
import { notFoundError, requestError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';

type GetPaymentByTicketIdParams = {
  ticketId: number;
  userId: number;
};

async function getPaymentByTicketId({ ticketId, userId }: GetPaymentByTicketIdParams) {
  if (!ticketId) throw requestError(httpStatus.BAD_REQUEST, 'Invalid Ticket Id.');

  const userIdRaw = await paymentRepository.getUserIdByTicketId(ticketId);

  if (!userIdRaw) throw unauthorizedError();

  const {
    Ticket: {
      Enrollment: { userId: paymentUserId },
    },
  } = userIdRaw;

  if (paymentUserId !== userId) throw unauthorizedError();

  const payment = await paymentRepository.getPaymentByTicketId(ticketId);

  if (!payment) throw notFoundError();

  return payment;
}

const paymentService = {
  getPaymentByTicketId,
};

export default paymentService;

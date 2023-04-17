import httpStatus from 'http-status';
import { notFoundError, requestError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import { PaymentSchema } from '@/schemas/payments-schemas';
import ticketRepository from '@/repositories/tickets-repository';

type GetPaymentByTicketIdParams = {
  ticketId: number;
  userId: number;
};

type CreatePaymentParams = PaymentSchema & {
  userId: number;
};

async function getPaymentByTicketId({ ticketId, userId }: GetPaymentByTicketIdParams) {
  if (!ticketId) throw requestError(httpStatus.BAD_REQUEST, 'Invalid Ticket Id.');

  const userIdRaw = await paymentRepository.getUserIdByTicketId(ticketId);

  if (!userIdRaw) throw notFoundError();

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

async function createPayment({ ticketId, cardData, userId }: CreatePaymentParams) {
  if (!ticketId || !cardData) throw requestError(httpStatus.BAD_REQUEST, 'Invalid Ticket Id.');
  const ticket = await ticketRepository.getTicketById(ticketId);
  console.log(ticket);
  if (!ticket) throw notFoundError();

  const {
    Ticket: {
      Enrollment: { userId: paymentUserId },
    },
  } = await paymentRepository.getUserIdByTicketId(ticketId);
  if (paymentUserId !== userId) throw unauthorizedError();

  const cardLastDigits = cardData.number.toString().slice(-4);

  const createPaymentParams = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits,
  };

  const payment = await paymentRepository.insertPayment(createPaymentParams);

  await ticketRepository.updateTicketStatus(ticketId);

  return payment;
}

const paymentService = {
  getPaymentByTicketId,
  createPayment,
};

export default paymentService;

import { prisma } from '@/config';
import { PaymentSchema } from '@/schemas/payments-schemas';

type insertPayementParams = {
  ticketId: number;
  value: number;
  cardIssuer: 'VISA' | 'MASTERCARD';
  cardLastDigits: string;
};

async function getUserIdByTicketId(ticketId: number) {
  return await prisma.payment.findFirst({
    select: {
      Ticket: {
        select: {
          Enrollment: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
    where: {
      ticketId,
    },
  });
}

async function getPaymentByTicketId(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function insertPayment({ cardIssuer, cardLastDigits, ticketId, value }: insertPayementParams) {
  return await prisma.payment.create({
    data: {
      cardIssuer,
      cardLastDigits,
      value,
      ticketId,
    },
  });
}

const paymentRepository = {
  getUserIdByTicketId,
  getPaymentByTicketId,
  insertPayment,
};

export default paymentRepository;

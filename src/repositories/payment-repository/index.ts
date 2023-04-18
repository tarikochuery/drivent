import { prisma } from '@/config';

type insertPaymentParams = {
  ticketId: number;
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

async function getUserIdByTicketId(ticketId: number) {
  const {
    Enrollment: { userId },
  } = await prisma.ticket.findFirst({
    select: {
      Enrollment: {
        select: {
          userId: true,
        },
      },
    },
    where: {
      id: ticketId,
    },
  });

  return userId;
}

async function getPaymentByTicketId(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function insertPayment({ cardIssuer, cardLastDigits, ticketId, value }: insertPaymentParams) {
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

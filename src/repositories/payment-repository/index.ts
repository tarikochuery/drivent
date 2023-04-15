import { prisma } from '@/config';

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

const paymentRepository = {
  getUserIdByTicketId,
  getPaymentByTicketId,
};

export default paymentRepository;

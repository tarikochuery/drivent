import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getAllTicketsTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function getTicketByUserId(userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      Ticket: {
        include: {
          TicketType: true,
        },
      },
    },
  });
}

const ticketRepository = {
  getAllTicketsTypes,
  getTicketByUserId,
};

export default ticketRepository;

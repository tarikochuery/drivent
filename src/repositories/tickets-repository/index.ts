import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

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

async function createTicket({ status, enrollmentId, ticketTypeId }: CreateTicketParams) {
  return await prisma.ticket.create({
    include: {
      TicketType: true,
    },
    data: {
      status,
      ticketTypeId,
      enrollmentId,
    },
  });
}

const ticketRepository = {
  getAllTicketsTypes,
  getTicketByUserId,
  createTicket,
};

export default ticketRepository;

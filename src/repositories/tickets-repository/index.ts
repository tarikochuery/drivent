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

async function getTicketById(ticketId: number) {
  return await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function updateTicketStatus(ticketId: number) {
  return await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
}

const ticketRepository = {
  getAllTicketsTypes,
  getTicketByUserId,
  createTicket,
  getTicketById,
  updateTicketStatus,
};

export default ticketRepository;

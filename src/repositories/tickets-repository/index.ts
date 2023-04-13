import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getAllTicketsTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

const ticketRepository = {
  getAllTicketsTypes,
};

export default ticketRepository;

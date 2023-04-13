import { TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/tickets-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.getAllTicketsTypes();
  return ticketTypes;
}

const ticketService = {
  getTicketTypes,
};

export default ticketService;

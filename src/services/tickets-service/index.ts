import { TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.getAllTicketsTypes();
  return ticketTypes;
}

async function getUserTicket(userId: number) {
  const rawTicket = await ticketRepository.getTicketByUserId(userId);
  if (!rawTicket) throw notFoundError();
  const [ticketInfo] = rawTicket.Ticket;
  if (!ticketInfo) throw notFoundError();
  const ticket = { ...ticketInfo, enrollmentId: rawTicket.id };
  return ticket;
}

const ticketService = {
  getTicketTypes,
  getUserTicket,
};

export default ticketService;

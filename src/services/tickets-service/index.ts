import { TicketStatus, TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import userRepository from '@/repositories/user-repository';

type CreateTicketParams = {
  ticketTypeId: number;
  userId: number;
};

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

async function createTicket({ ticketTypeId, userId }: CreateTicketParams) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const { id: enrollmentId } = enrollment;
  const status: TicketStatus = 'RESERVED';

  const ticket = await ticketRepository.createTicket({ ticketTypeId, enrollmentId, status });
  return ticket;
}

const ticketService = {
  getTicketTypes,
  getUserTicket,
  createTicket,
};

export default ticketService;

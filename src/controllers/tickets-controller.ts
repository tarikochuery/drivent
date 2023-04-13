import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '@/services/tickets-service';

export async function getTicketTypes(req: Request, res: Response) {
  try {
    const ticketTypes = await ticketService.getTicketTypes();
    return res.send(ticketTypes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

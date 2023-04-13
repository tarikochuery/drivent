import { NextFunction, Request, Response } from 'express';
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

export async function getTicket(req: Request & { userId: number }, res: Response) {
  const { userId } = req;
  try {
    const ticket = await ticketService.getUserTicket(userId);
    return res.send(ticket);
  } catch (error) {
    console.log(error);
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

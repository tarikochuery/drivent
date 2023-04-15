import { Router } from 'express';
import { createTicket, getTicket, getTicketTypes } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { CreateTicketSchema, createTicketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getTicket)
  .post('/', validateBody<CreateTicketSchema>(createTicketSchema), createTicket);

export { ticketsRouter };

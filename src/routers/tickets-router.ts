import { Router } from 'express';
import { getTicketTypes } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketTypes).get('/').post('/');

export { ticketsRouter };

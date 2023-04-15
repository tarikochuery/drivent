import { Router } from 'express';
import { getPayment } from '@/controllers/payments-controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken, getPayment).get('/').post('/process');

export { paymentsRouter };

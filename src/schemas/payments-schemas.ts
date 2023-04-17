import Joi, { ObjectSchema } from 'joi';

export type PaymentSchema = {
  ticketId: number;
  cardData: {
    issuer: 'VISA' | 'MASTERCARD';
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export const paymentSchema: ObjectSchema<PaymentSchema> = Joi.object({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required().valid('VISA', 'MASTERCARD'),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().required(),
  }),
});

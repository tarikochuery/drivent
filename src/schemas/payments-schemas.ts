import Joi, { ObjectSchema } from 'joi';

export type PaymentSchema = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: string;
    name: string;
    expirationDate: string;
    cvv: string;
  };
};

export const paymentSchema: ObjectSchema<PaymentSchema> = Joi.object({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.string().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.string().required(),
  }),
});

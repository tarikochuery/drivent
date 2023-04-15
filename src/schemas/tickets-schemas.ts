import Joi from 'joi';

export type CreateTicketSchema = {
  ticketTypeId: number;
};

export const createTicketSchema: Joi.ObjectSchema<CreateTicketSchema> = Joi.object({
  ticketTypeId: Joi.number().required(),
});

import Joi, { ObjectSchema } from 'joi';

export type BookingSchema = {
  roomId: number;
};

export const bookingSchema: ObjectSchema<BookingSchema> = Joi.object({
  roomId: Joi.number().required().min(1),
});

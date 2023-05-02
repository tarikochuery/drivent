import Joi, { ObjectSchema, Schema } from 'joi';

export type BookingSchema = {
  roomId: number;
};

export type BookingParams = {
  bookingId: string;
};

export const bookingSchema: ObjectSchema<BookingSchema> = Joi.object({
  roomId: Joi.number().required().min(1),
});

export const bookingParams: ObjectSchema<BookingParams> = Joi.object({
  bookingId: Joi.string().required(),
});

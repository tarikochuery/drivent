import { prisma } from '@/config';
import { BookingSchema } from '@/schemas';

export type CreateBookingParams = BookingSchema & {
  userId: number;
};

async function getBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function getBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: {
      roomId,
    },
  });
}

async function createBooking({ roomId, userId }: CreateBookingParams) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
    select: {
      roomId: true,
    },
  });
}

const bookingRepository = {
  getBookingByUserId,
  getBookingByRoomId,
  createBooking,
};

export default bookingRepository;

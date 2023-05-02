import { prisma } from '@/config';
import { BookingSchema } from '@/schemas';

export type CreateBookingParams = BookingSchema & {
  userId: number;
  bookingId?: number;
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

async function getBookingById(bookingId: number) {
  return prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
}

async function upsertBooking({ roomId, userId, bookingId }: CreateBookingParams) {
  return prisma.booking.upsert({
    where: {
      id: bookingId || 0,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
      userId,
    },
    select: {
      id: true,
    },
  });
}

const bookingRepository = {
  getBookingByUserId,
  getBookingByRoomId,
  getBookingById,
  upsertBooking,
};

export default bookingRepository;

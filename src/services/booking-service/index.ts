import ticketService from '../tickets-service';
import { notFoundError } from '@/errors';
import bookingRepository, { CreateBookingParams } from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { forbiddenAccessError } from '@/errors/forbidden-access-error';
import hotelRepository from '@/repositories/hotel-repository';
import roomRepository from '@/repositories/room-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBookingByUserId(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function createBooking({ userId, roomId }: CreateBookingParams) {
  const { id: enrollmentId } = await enrollmentRepository.findWithAddressByUserId(userId);
  const {
    status: ticketStatus,
    TicketType: { includesHotel, isRemote },
  } = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);

  if (ticketStatus !== 'PAID' || !includesHotel || isRemote) throw forbiddenAccessError();

  const doesRoomExist = await roomRepository.getRoomById(roomId);

  if (!doesRoomExist) throw notFoundError();

  const isRoomBooked = !!(await bookingRepository.getBookingByRoomId(roomId));

  if (isRoomBooked) throw forbiddenAccessError();

  const { id } = await bookingRepository.createBooking({ roomId, userId });

  return { bookingId: id };
}

const bookingService = {
  getBooking,
  createBooking,
};

export default bookingService;

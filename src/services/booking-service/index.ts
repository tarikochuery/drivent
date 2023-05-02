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
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenAccessError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw forbiddenAccessError();

  const {
    status: ticketStatus,
    TicketType: { includesHotel, isRemote },
  } = ticket;

  if (ticketStatus !== 'PAID' || !includesHotel || isRemote) throw forbiddenAccessError();

  const doesRoomExist = await roomRepository.getRoomById(roomId);

  if (!doesRoomExist) throw notFoundError();

  const isRoomBooked = !!(await bookingRepository.getBookingByRoomId(roomId));

  if (isRoomBooked) throw forbiddenAccessError();

  const { id } = await bookingRepository.upsertBooking({ roomId, userId });

  return { bookingId: id };
}

async function updateBooking({ userId, roomId, bookingId }: CreateBookingParams) {
  const bookingIdExists = await bookingRepository.getBookingById(bookingId);
  if (!bookingIdExists) throw forbiddenAccessError();

  const userBooking = await bookingRepository.getBookingByUserId(userId);
  if (userBooking.id !== bookingId) throw forbiddenAccessError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenAccessError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw forbiddenAccessError();

  const {
    status: ticketStatus,
    TicketType: { includesHotel, isRemote },
  } = ticket;

  if (ticketStatus !== 'PAID' || !includesHotel || isRemote) throw forbiddenAccessError();

  const doesRoomExist = await roomRepository.getRoomById(roomId);

  if (!doesRoomExist) throw notFoundError();

  const isRoomBooked = !!(await bookingRepository.getBookingByRoomId(roomId));

  if (isRoomBooked) throw forbiddenAccessError();

  const { id } = await bookingRepository.upsertBooking({ roomId, userId, bookingId });

  return { bookingId: id };
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};

export default bookingService;

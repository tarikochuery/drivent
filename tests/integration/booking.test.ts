import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

const server = supertest(app);

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

describe('GET /booking', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if invalid token is given', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when valid token', () => {
    it("Should respond with status 404 when user doesn't have reservation", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });
    it('Should respond with status 200 an booking data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: expect.objectContaining({}),
      });
    });
  });
});

describe('POST /booking', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if invalid token is given', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('When token is valid', () => {
    it("should respond with status 404 when room doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({
        isRemote: false,
        includesHotel: true,
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const roomNotExistId = faker.datatype.number({ min: 1 });
      const response = await server
        .post('/booking')
        .send({ roomId: roomNotExistId })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 403 when ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({
        isRemote: true,
        includesHotel: true,
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const response = await server.post('/booking').send({ roomId: room.id }).set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with status 403 when hotel is not included', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({
        isRemote: false,
        includesHotel: false,
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const response = await server.post('/booking').send({ roomId: room.id }).set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with status 403 when ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({
        isRemote: false,
        includesHotel: true,
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const response = await server.post('/booking').send({ roomId: room.id }).set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with status 200 and booking id.', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({
        isRemote: false,
        includesHotel: true,
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const response = await server.post('/booking').send({ roomId: room.id }).set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

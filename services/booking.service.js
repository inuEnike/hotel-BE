import { Room } from "../models/room.model.js";
import { BookingRepository } from "../repositories/booking.repository.js";
import { roomRepository } from "../repositories/room.repository.js";

export const BookingServices = {
  findAll: async () => {
    return await BookingRepository.getAll();
  },
  create: async (data) => {
    const { checkIn, checkOut, roomId, guests } = data;

    const conflict = await BookingRepository.findConflictBookings(
      checkIn,
      checkOut,
      roomId,
    );
    const room = await Room.findById(roomId);
    const totalGuests = guests.adult + (guests.children || 0);
    if (totalGuests > room.capacity.maxOccupancy) {
      throw new Error(
        `This room only allows ${room.capacity.maxOccupancy} people total.`,
      );
    }
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
    );
    if (nights <= 0)
      throw new Error("Check-out must be at least one day after check-in");

    const childFee = 2000; // Example: 2,000 extra per child per night
    const baseTotal = room.basePrice * nights;
    const childrenTotal = (guests.children || 0) * childFee * nights;
    const finalAmount = baseTotal + childrenTotal;

    if (!room) {
      throw new Error("The requested room does not exist.");
    }

    if (conflict.length > 0) {
      throw new Error("Room not available");
    }

    return BookingRepository.create({
      ...data,
      totalAmount: finalAmount,
      bookingStatus: "Pending",
    });
  },
  getAvailableRooms: async (checkIn, checkOut) => {
    // 1. find conflicting bookings
    const conflicts = await BookingRepository.findConflictBookings(
      checkIn,
      checkOut,
    );

    // 2. extract roomIds
    const bookedRoomIds = conflicts.map((b) => b.roomId);

    // 3. get available rooms
    return roomRepository.findAvailableRooms(bookedRoomIds);
  },

  deleteById: async (id) => {
    if (!id) {
      throw new Error("Id is needed");
    }
    const query = await BookingRepository.deleteById(id);

    if (!query) {
      throw new Error("Booking id is invalid");
    }

    return query;
  },

  findById: async (id) => {
    if (!id) {
      throw new Error("Id is needed");
    }
      return await BookingRepository.findById(id);

  },
};

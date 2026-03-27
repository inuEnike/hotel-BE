import { Booking } from "../models/booking.model.js";
export const BookingRepository = {
  findConflictBookings: async (checkin, checkOut, roomId = null) => {
    const query = {
      bookingStatus: { $ne: "Cancelled" },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkin) },
    };

    if (roomId) {
      query.roomId = roomId;
    }
    return Booking.find(query, {}, null).select("roomId");
  },
  create: async (data) => {
    return await new Booking(data).save();
  },
  getAll: async () => {
    return await Booking.find({}, {}, null).exec();
  },
  findById: async (id) => {
    return await Booking.findById(id, {}, null).exec();
  },

  deleteById: async (id) => {
    return Booking.findByIdAndDelete(id, null);
  },
};

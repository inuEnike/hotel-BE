import { Hotel } from "../models/hotel.model.js";

export const HotelRepository = {
  findAll: () => {
    return Hotel.find({}).exec();
  },
  findById: (id) => {
    return Hotel.findById(id).exec();
  },
  create: (data) => {
    return new Hotel(data).save();
  },
  updateById: (id, data) => {
    return Hotel.findByIdAndUpdate(id, data, { new: true }).exec();
  },
  deleteById: (id) => {
    return Hotel.findByIdAndDelete(id);
  },
};

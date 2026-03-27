import { Room } from "../models/room.model.js";

// room.repository.js
export const roomRepository = {
  findAvailableRooms: async (excludedRoomIds) => {
    return Room.find({
      _id: { $nin: excludedRoomIds }
    },
        {}, null);
  },
};

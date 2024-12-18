const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
  {
    roomType: {
      type: mongoose.Schema.ObjectId,
      ref: 'RoomType',
      required: [true, 'A Room must have a room type'],
    },
    roomNumber: {
      type: String,
      required: [true, 'A room must have a name'],
    },
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['booked', 'available'],
      default: 'available',
    },
    floor: {
      type: String,
      required: [true, 'A room must have a floor specified'],
    },
    specificAmenities: {
      type: [String],
      default: [],
    },
    currentBooking: {
      type: mongoose.Schema.ObjectId,
      ref: 'Booking',
      default: null,
    },
  },
  { timestamps: true },
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

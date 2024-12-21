const mongoose = require('mongoose');
const slugify = require('slugify');

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
      unique: true,
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
    slug: String,
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

// Pre-save hook to add a slug to the document based on name of the room-type
roomSchema.pre('save', function (next) {
  this.slug = slugify(this.roomNumber, { lower: true });

  next();
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

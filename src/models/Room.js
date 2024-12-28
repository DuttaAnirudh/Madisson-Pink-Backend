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
    specificAmenities: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Amenity',
        default: [],
      },
    ],
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

// Pre-save middleware to update roomType counts data
roomSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Only run this middleware for new rooms
    try {
      // Update the roomType document
      await mongoose.model('RoomType').findByIdAndUpdate(this.roomType, {
        $inc: {
          totalRoomsOfThisType: 1,
          currentAvailabiltyOfThisType: 1,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Query Middleware: Update slug when the roomNumber of the room is updated
roomSchema.pre('findOneAndUpdate', function (next) {
  // 'this' refers to the document
  const update = this.getUpdate(); // Gets the update operations being performed

  // Check if roomNumber is being updated
  if (update.roomNumber) {
    // If roomNumber is being updated, we set new updates using setUpdate
    this.setUpdate({
      ...update, // Spread existing updates
      slug: slugify(update.roomNumber, { lower: true }), // Add the new slug
    });
  }
  next();
});

// Populating room type and specific amenities in room data
roomSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'roomType',
    select: '-_id -__v',
  }).populate({
    path: 'specificAmenities',
    select: '-_id -__v',
  });

  next();
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

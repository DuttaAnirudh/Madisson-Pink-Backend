const mongoose = require('mongoose');

const roomTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A room type must have a name'],
      maxLength: [25, "A name can't have more than 25 charectors"],
    },
    basePrice: {
      type: Number,
      required: [true, 'A room type must have a base price'],
      min: [0, 'Price cannot be negative'],
      max: [10000, 'Price seems unrealistically high'],
    },
    description: {
      type: String,
      required: [true, 'a room type must have a description'],
      maxLength: [
        120,
        "The room description can't have more than 120 charectors",
      ],
    },
    maxOccupancy: {
      type: Number,
      required: [true, 'A room type must have a Maximum Oppupancy'],
    },
    standardAmenities: [String],
    totalRoomsOfThisType: {
      type: Number,
      required: [true, 'Total number of rooms for this type must be specified'],
      min: [0, 'Total rooms cannot be negative'],
    },
    seasonalPricing: [
      {
        season: {
          type: String,
          enum: ['summer', 'winter', 'spring', 'fall'],
        },
        price: {
          type: Number,
          validate: {
            validator: function (v) {
              return v > 0;
            },
            message: 'Seasonal price must be a positive number',
          },
        },
        startDate: Date,
        endDate: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    currentAvailabiltyOfThisType: {
      type: Number,
      min: [0, 'Current availability cannot be negative'],
      required: true,
      validate: {
        validator: function (value) {
          return value <= this.totalRoomsOfThisType;
        },
        message:
          'Currently available rooms cannot exceed total rooms of this type.',
      },
    },
  },

  { timestamps: true },
);

// Pre-save hook to ensure the initial available rooms match total rooms
roomTypeSchema.pre('save', function (next) {
  if (this.isNew && this.currentAvailabiltyOfThisType === undefined) {
    this.currentAvailabiltyOfThisType = this.totalRoomsOfThisType;
  }
  next();
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);

module.exports = RoomType;

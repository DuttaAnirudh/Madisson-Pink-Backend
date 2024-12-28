const mongoose = require('mongoose');
const slugify = require('slugify');

const roomTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A room type must have a name'],
      maxLength: [25, "A name can't have more than 25 charectors"],
      unique: true,
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
    slug: String,
    totalRoomsOfThisType: {
      type: Number,
      min: [0, 'Total rooms cannot be negative'],
      default: 0,
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
  // 'this' refers to the document
  if (this.isNew && this.currentAvailabiltyOfThisType === undefined) {
    this.currentAvailabiltyOfThisType = this.totalRoomsOfThisType;
  }
  next();
});

// Pre-save hook to add a slug to the document based on name of the room-type
roomTypeSchema.pre('save', function (next) {
  // 'this' refers to the document
  this.slug = slugify(this.name, { lower: true });

  next();
});

// Query Middleware: Update slug when the name of the room type is updated
roomTypeSchema.pre('findOneAndUpdate', function (next) {
  // 'this' refers to the document
  const update = this.getUpdate(); // Gets the update operations being performed

  // Check if name is being updated
  if (update.name) {
    // If name is being updated, we set new updates using setUpdate
    this.setUpdate({
      ...update, // Spread existing updates
      slug: slugify(update.name, { lower: true }), // Add the new slug
    });
  }
  next();
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);

module.exports = RoomType;

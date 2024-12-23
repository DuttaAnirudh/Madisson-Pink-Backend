const mongoose = require('mongoose');
const slugify = require('slugify');

const amenitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An amenity must have a name'],
      maxLength: [30, "Name can't be longer than 30 characters"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'An amenity must have a description'],
      maxLength: [200, "Description can't be longer than 200 characters"],
    },
    price: {
      type: Number,
      required: [true, 'An amenity must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    priceType: {
      type: String,
      required: [true, 'Please specify price type'],
      enum: ['per_person', 'per_use', 'per_hour', 'fixed'],
    },
    category: {
      type: String,
      required: [true, 'An amenity must have a category'],
      enum: [
        'spa',
        'dining',
        'sports',
        'entertainment',
        'transport',
        'housekeeping',
      ],
    },
    slug: String,
    availability: {
      type: Boolean,
      default: true,
    },
    bookingLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    availabilitySchedule: {
      startTime: {
        type: String,
        required: [true, 'Please specify start time'],
      },
      endTime: {
        type: String,
        required: [true, 'Please specify end time'],
      },
      daysAvailable: [
        {
          type: String,
          enum: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
        },
      ],
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    location: {
      type: String,
      required: [true, 'Please specify where this amenity is available'],
    },
    requiresAdvanceBooking: {
      type: Boolean,
      default: false,
    },
    advanceBookingTimeRequired: {
      type: Number, // in hours
      default: 0,
    },
    staffRequired: {
      type: Boolean,
      default: false,
    },
    ageRestriction: {
      minAge: {
        type: Number,
        default: 0,
      },
      maxAge: {
        type: Number,
        default: null,
      },
    },
    seasonalAvailability: [
      {
        season: {
          type: String,
          enum: ['summer', 'winter', 'spring', 'fall'],
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        specialPrice: {
          type: Number,
          default: null,
        },
      },
    ],
    termsAndConditions: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Validate advance booking time if required
amenitySchema.pre('save', function (next) {
  if (this.requiresAdvanceBooking && this.advanceBookingTimeRequired <= 0) {
    throw new Error(
      'Advance booking time must be positive when advance booking is required',
    );
  }
  next();
});

// Create a slug for the name of the amenity when a new amenity is created or saved
amenitySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// Query Middleware: Update slug when the name of the amenity is updated
amenitySchema.pre('findOneAndUpdate', function (next) {
  // 'this' refers to the document
  const update = this.getUpdate(); // Gets the update operations being performed

  // Check if roomNumber is being updated
  if (update.name) {
    // If name is being updated, we set new updates using setUpdate
    this.setUpdate({
      ...update, // Spread existing updates
      slug: slugify(update.name, { lower: true }), // Add the new slug
    });
  }

  next();
});

const Amenity = mongoose.model('Amenity', amenitySchema);

module.exports = Amenity;

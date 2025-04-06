const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'beauty',
        'plumbing',
        'mechanics',
        'drivers',
        'cooking',
        'cleaning',
        'other',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be less than 0'],
    },
    image: {
      type: String,
      default: 'default-service.jpg',
    },
    features: [
      {
        type: String,
      },
    ],
    providers: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    availableDates: [
      {
        type: Date,
      },
    ],
    availableTimes: [
      {
        type: String,
      },
    ],
    isPopular: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for top providers
ServiceSchema.virtual('topProviders', {
  ref: 'Provider',
  localField: '_id',
  foreignField: 'services.service',
  justOne: false,
  options: { limit: 3 },
});

module.exports = mongoose.model('Service', ServiceSchema); 
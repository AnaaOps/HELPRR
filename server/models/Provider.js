const mongoose = require('mongoose');
const slugify = require('slugify');

const ProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    specialty: {
      type: String,
      required: [true, 'Please add a specialty'],
      maxlength: [100, 'Specialty cannot be more than 100 characters']
    },
    bio: {
      type: String,
      required: [true, 'Please add a bio'],
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    experience: {
      type: Number,
      required: [true, 'Please add years of experience']
    },
    services: [
      {
        service: {
          type: mongoose.Schema.ObjectId,
          ref: 'Service',
          required: true
        },
        price: {
          type: Number
        },
        customDescription: {
          type: String,
          maxlength: [200, 'Custom description cannot be more than 200 characters']
        },
        isAvailable: {
          type: Boolean,
          default: true
        }
      }
    ],
    availability: {
      monday: {
        isAvailable: { type: Boolean, default: true },
        from: { type: String, default: '09:00' },
        to: { type: String, default: '17:00' }
      },
      tuesday: {
        isAvailable: { type: Boolean, default: true },
        from: { type: String, default: '09:00' },
        to: { type: String, default: '17:00' }
      },
      wednesday: {
        isAvailable: { type: Boolean, default: true },
        from: { type: String, default: '09:00' },
        to: { type: String, default: '17:00' }
      },
      thursday: {
        isAvailable: { type: Boolean, default: true },
        from: { type: String, default: '09:00' },
        to: { type: String, default: '17:00' }
      },
      friday: {
        isAvailable: { type: Boolean, default: true },
        from: { type: String, default: '09:00' },
        to: { type: String, default: '17:00' }
      },
      saturday: {
        isAvailable: { type: Boolean, default: false },
        from: { type: String, default: '09:00' },
        to: { type: String, default: '17:00' }
      },
      sunday: {
        isAvailable: { type: Boolean, default: false },
        from: { type: String, default: '09:00' },
        to: { type: String, default: '17:00' }
      }
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number cannot be longer than 20 characters']
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String
      }
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    photo: {
      type: String,
      default: 'default-provider.jpg'
    },
    certifications: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create provider slug from the name
ProviderSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete bookings when a provider is deleted
ProviderSchema.pre('remove', async function(next) {
  await this.model('Booking').deleteMany({ provider: this._id });
  next();
});

// Reverse populate with virtuals
ProviderSchema.virtual('providerReviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'provider',
  justOne: false
});

module.exports = mongoose.model('Provider', ProviderSchema); 
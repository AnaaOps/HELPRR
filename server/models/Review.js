const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.ObjectId,
    ref: 'Provider',
    required: true
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent user from submitting more than one review per provider
ReviewSchema.index({ provider: 1, user: 1 }, { unique: true });

// Static method to get avg rating
ReviewSchema.statics.getAverageRating = async function(providerId) {
  const obj = await this.aggregate([
    {
      $match: { provider: providerId }
    },
    {
      $group: {
        _id: '$provider',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Provider').findByIdAndUpdate(providerId, {
      rating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      reviewCount: obj[0] ? obj.length : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.provider);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.provider);
});

module.exports = mongoose.model('Review', ReviewSchema); 
// models/trips.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  isPublic      : { type: Boolean, required: true },
  place         : { type: String , required: true, text: true },
  notes         : { type: String , required: true },
  coverImageUrl : { type: String },
  hotels        : [{ type: Schema.Types.ObjectId, ref: 'Hotel'}],
  sites         : { type: Array   },
  startDate     : { type: Date    },
  endDate       : { type: Date    },
  userId        : { type: Schema.Types.ObjectId, ref: 'User' }
});

TripSchema.pre('save', function(next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt ) {
    this.createdAt = now;
  }
  next()
});

module.exports = mongoose.model('Trip', TripSchema);

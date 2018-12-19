// models/trips.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  isPublic      : { type: Boolean, default: false },
  place         : { type: String , required: true, text: true },
  notes         : { type: String , default: '' },
  coverImageUrl : { type: String },
  hotels        : [{ type: Schema.Types.ObjectId, ref: 'Hotel'}],
  sites         : [{ type: Schema.Types.ObjectId, ref: 'Site'}],
  startDate     : { type: Date    },
  endDate       : { type: Date    },
  userId        : { type: Schema.Types.ObjectId, ref: 'User' }
});

// SET createdAt AND updatedAt
TripSchema.pre('save', function(next) {
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt ) {
    this.createdAt = now;
  }
  next()
});


TripSchema.post('remove', function(next) {
    Hotel.remove({ trip: this._id }).exec();
    Site.remove({ trip: this._id }).exec();
    next();
});

module.exports = mongoose.model('Trip', TripSchema);

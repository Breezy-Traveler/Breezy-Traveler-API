// models/hotels.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  name          : { type: String  },
  address       : { type: String  },
  tripId        : { type: Schema.Types.ObjectId, ref: 'Trip' }
});


HotelSchema.pre('save', function(next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt ) {
    this.createdAt = now;
  }
  next()
});

module.exports = mongoose.model('Hotel', HotelSchema);
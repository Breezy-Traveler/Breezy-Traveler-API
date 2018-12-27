// models/hotels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Trip = require('./trip')

const HotelSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  name          : { type: String, required: true },
  address       : { type: String, default: "" },
  tripId        : { type: Schema.Types.ObjectId, ref: 'Trip' }
});

// SET createdAt AND updatedAt
HotelSchema.pre('save', function(next) {
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt ) {
    this.createdAt = now
  }
  next()
});

HotelSchema.pre('remove', function(next) {
  console.log("the hotel pre remove function was called")
    Trip.update(
        { hotel_ids : this._id},
        { $pull: { hotel_ids: this._id } },
        { multi: true })  // if reference exists in multiple documents
    .exec();
    next();
});

module.exports = mongoose.model('Hotel', HotelSchema);

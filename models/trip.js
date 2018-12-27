// models/trips.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Hotel = require('./hotel')
const Site = require('./site')


const TripSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  isPublic      : { type: Boolean, default: false },
  place         : { type: String , required: true, text: true },
  notes         : { type: String , default: '' },
  coverImageUrl : { type: String },
  hotel_ids     : [{ type: Schema.Types.ObjectId, ref: 'Hotel'}],
  site_ids      : [{ type: Schema.Types.ObjectId, ref: 'Site'}],
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

TripSchema.pre('remove', function(next) {
    // 'this' is the trip being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Hotel.findByIdAndRemove({ trip_id: this._id })
    .exec(removedHotel => {
      console.log('removed hotel: ', removedHotel)
    })
    .catch(err => {
      if (err) {
        console.log(err.message)
      }
    });
    Site.findByIdAndRemove({ trip_id: this._id })
    .exec(removedSite => {
      console.log('removed site: ', removedSite)
    })
    .catch(err => {
      if (err) {
        console.log(err.message)
      }
    });
    next();
});


module.exports = mongoose.model('Trip', TripSchema);

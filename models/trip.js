// models/trips.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Hotel = require('./hotel')
const Site = require('./site')


const TripSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  isPublic: { type: Boolean, default: false },
  place: { type: String, required: true, text: true },
  notes: { type: String, default: '' },
  coverImageUrl: { type: String },
  hotel_ids: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
  site_ids: [{ type: Schema.Types.ObjectId, ref: 'Site' }],
  startDate: { type: Date },
  endDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

// SET createdAt AND updatedAt
TripSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }
  next()
});

TripSchema.post('remove', function () {
  // 'this' is the trip being removed
  // Iterate through the hotel ids, and remove them from the db
  this.hotel_ids.forEach(function (_id) {
    Hotel.findByIdAndRemove({ _id })
      .exec((err, removedHotel) => {        
        if (err) {
          console.log("Callback Trip pre remove: ", err.message)
        }
        console.log('removed hotel: ', removedHotel)
      })
  });

  this.site_ids.forEach(function (_id) {
    Site.findByIdAndRemove({ _id })
      .exec((err, removedSite) => {        
        if (err) {
          console.log("Callback Trip pre remove: ", err.message)
        }
        console.log('removed site: ', removedSite)
      })
  });
});


module.exports = mongoose.model('Trip', TripSchema);

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

TripSchema.pre('remove', function (next) {
  // 'this' is the trip being removed. 
  // Provide callbacks here to be notified of the calls' result
  console.log('Hotel ids array: ', this.hotel_ids)
  this.hotel_ids.forEach(function (_id) {
    // id = id.replace(/\s/g,'');
    console.log("type: ", typeof _id.toString())
    console.log("inside the forEach hotel_id: ", _id)
    Hotel.findByIdAndRemove({
        _id
      })
      .exec(removedHotel => {
        console.log('removed hotel: ', removedHotel)
      })
      .catch(err => {
        if (err) {
          console.log("Catch block Hotel.findByIdAndRemove(): ", err.message)
        }
      });
  });

  // this.site_ids.forEach(function(siteId) {
  //   Site.findByIdAndRemove({
  //     site_id: siteId
  //   })
  //   .exec(removedSite => {
  //     console.log('removed site: ', removedSite)
  //   })
  //   .catch(err => {
  //     if (err) {
  //       console.log(err.message)
  //     }
  //   });
  // });
  next();
});


module.exports = mongoose.model('Trip', TripSchema);

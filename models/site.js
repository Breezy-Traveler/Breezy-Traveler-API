// models/sites.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Trip = require('./trip');

const SiteSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  name          : { type: String, required: true },
  address       : { type: String, default: "" },
  trip_id        : { type: Schema.Types.ObjectId, ref: 'Trip' }
});

// SET createdAt AND updatedAt
SiteSchema.pre('save', function(next) {
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt ) {
    this.createdAt = now
  }
  next()
});

SiteSchema.pre('remove', function(next) {
  console.log("the site pre remove function was called")
    Client.update(
        { site_ids : this._id},
        { $pull: { site_ids: this._id } },
        { multi: true })  // if reference exists in multiple documents
    .exec();
    next();
});

module.exports = mongoose.model('Site', SiteSchema);

// models/sites.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  name          : { type: String, required: true },
  address       : { type: String, default: "" },
  tripId        : { type: Schema.Types.ObjectId, ref: 'Trip' }
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

module.exports = mongoose.model('Site', SiteSchema);

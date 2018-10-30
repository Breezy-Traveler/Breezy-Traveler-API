const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  isPublic      : { type: Boolean },
  place         : { type: String  },
  notes         : { type: String  },
  coverImageUrl : { type: String  },
  hotels        : { type: Array   },
  sites         : { type: Array   },
  startDate     : { type: Date    },
  endDate       : { type: Date    }
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




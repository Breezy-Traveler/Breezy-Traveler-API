const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  isPublic      : { type: Boolean, required: true },
  place         : { type: String,  required: true  },
  notes         : { type: String  },
  coverImageUrl : { type: String  },
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
});



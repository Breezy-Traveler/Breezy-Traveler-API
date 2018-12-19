// models/profileImg.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  createdAt     : { type: Date    },
  updatedAt     : { type: Date    },
  imgBinary           : { type: String  }
})

// SET createdAt AND updatedAt
ImageSchema.pre('save', function(next) {
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt ) {
    this.createdAt = now;
  }
  next()
});

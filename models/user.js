// models/users.js

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema(
  {
    local: {
      username   : { type: String, unique: true },
      email      : { type: String, unique: true },
      password   : { type: String, required: true },
      token      : { type: String }
    },
    facebook: {
      id         : String,
      token      : String,
      name       : String,
      email      : String
    }
  }
);

// METHODS ==============================
// GENERATE HASH
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// VALIDATE PASSWORD
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 90);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    process.env.SECRET)
};

UserSchema.methods.toAuthJSON = function() {
  return this.generateJWT();
};

UserSchema.statics.currentUser = function(token, done) {
	this.findOne({ 'local.token': token }, done)
};

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);

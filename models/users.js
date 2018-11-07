// models/users.js

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

// define the schema for our user model
const UserSchema = mongoose.Schema({

  local           : {
    username      : { type: String, unique: true },
    email         : { type: String, unique: true },
    password      : { type: String, required: true },
    token         : { type: String }
  },
  facebook         : {
    id           : String,
    token        : String,
    name         : String,
    email        : String
  },
  twitter          : {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String
  },
  google           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  }
});

// methods ==============================

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if the password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 90);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, process.env.SECRET);
};

UserSchema.methods.toAuthJSON = function() {
  return this.generateJWT();
};


UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
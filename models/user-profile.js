var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserProfileImageSchema = Schema({
  payload: { type: Buffer, required: true }, //image is stored here
  type: { type: String, required: true }
});

module.exports = mongoose.model('UserProfileImage', UserProfileImageSchema)
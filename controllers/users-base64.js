var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authorized = require('../src/config/auth');
const setCurrentUser = require('./set-current-user');

const UserProfileImageSchema = Schema({
  payload: Buffer, //image is stored here
  type: String
});

const PImage = mongoose.model('UserProfileImage', UserProfileImageSchema)

router.post('/userProfile', authorized.required, setCurrentUser, (req, res, next) => {
  image = {
    payload: new Buffer(req.body.payload, 'base64'),
    type: req.body.type
  }
  PImage.create(image)
    .then((imageDoc) => {

      //TODO: delete the old PImage if it exists

      req.currentUser.profileImage = imageDoc
      req.currentUser.save()
        .then(udpatedUser => {
          udpatedUser.profileImage = imageDoc._id
          res.json(udpatedUser)
        })
        .catch(error => {
          res.status(400).send(error)
        })
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

router.get('/userProfile/:userProfileId', (req, res, next) => {
  userProfileId = req.params.userProfileId
  if (userProfileId == "no-image") {
    //TODO: respond back a default image
  } else {
    PImage.findById(userProfileId)
      .then((imageDoc) => {
        res.contentType(imageDoc.type)
        res.send(imageDoc.payload)
      })
      .catch(error => {
        res.status(400).send(error)
      })
  }
})

module.exports = router
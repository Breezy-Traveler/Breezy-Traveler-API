// controllers/users.js

module.exports = (app, passport) => {
  const auth = require('../src/config/auth');
  const authorized = require('../src/config/auth');
  const setCurrentUser = require('./set-current-user');
  const UserProfileImage = require('../models/user-profile');
  const request = require('request');

  // =====================================
  // LOGIN ===============================
  // =====================================
  app.post('/login', function (req, res, next) {
    passport.authenticate('local-login', function (err, user) {

      if (err) { return next(err); }
      if (!user) { return res.status(401).json({ 'Error': 'Unauthorized' }); }

      req.logIn(user, function (err) {
        if (err) { return next(err); }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  app.post('/signup', function (req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!username && !email && !password) {
      return res.status(400).json({ 'Error': 'Must provide all user credentials' })
    } else if (!username) {
      return res.status(400).json({ 'Error': 'Must provide username' })
    } else if (!email) {
      return res.status(400).json({ 'Error': 'Must provide valid email' })
    } else if (!password) {
      return res.status(400).json({ 'Error': 'Must provide valid password' })
    }

    passport.authenticate('local-signup', function (err, user) {

      if (err) {
        let foundErr = (err.message).split(' ');
        let emailError = false;
        let usernameError = false;

        for (let i = 0; i < foundErr.length; i++) {
          if (foundErr[i] === '`local.email`') { emailError = true }
          else if (foundErr[i] === '`local.username`') { usernameError = true }
        }

        if (emailError && usernameError) {
          return res.status(401).json({ 'Error': 'Email and Username taken' })
        } else if (emailError) {
          return res.status(401).json({ 'Error': 'Email already taken' })
        } else {
          return res.status(401).json({ 'Error': 'Username already taken' })
        }
      }

      res.status(201).json(user)
    })(req, res, next);
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', (req, res) => {
    req.logout(); // provided by passport
    res.status(200).send('user is logged out')
  });

  // =====================================
  // USER PROFILE ========================
  // =====================================

  app.post('/userProfile', authorized.required, setCurrentUser, (req, res, next) => {
    image = {
      payload: new Buffer(req.body.payload, 'base64'),
      type: req.body.type
    }

    UserProfileImage.create(image)
      .then((imageDoc) => {

        //TODO: delete the old UserProfileImage if it exists

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

  app.get('/userProfile/:userProfileId', (req, res, next) => {
    const userProfileId = req.params.userProfileId

    if (userProfileId == "no-image") {
      const options = {
        url: "https://via.placeholder.com/512/0000FF/808080"
      };

      request(options, (err, response, body) => {
        if (err) {
          res.status(400).json({ 'Error: ': `${err.message}` })
        } else {
          res.status(200).send(body)
        }
      })

    } else {
      UserProfileImage.findById(userProfileId)
        .then((imageDoc) => {
          if (imageDoc) {
            res.contentType(imageDoc.type)
            res.send(imageDoc.payload)
          } else {
            res.status(404).send("No image found")
          }
        })
        .catch(error => {
          res.status(400).send(error)
        })
    }
  })
};

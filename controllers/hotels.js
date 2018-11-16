// controllers/hotels.js

module.exports = (app) => {

  const Hotel  = require('../models/hotels');
  const User   = require('../models/users');
  const authorized = require('../src/config/auth');

  // CREATE a hotel
  app.post('/trips/:id/hotels', authorized.required, (req, res) => {

    User.currentUser(req.token, (err, user) => {
      if (err) {
        // unauthorized
        return res.status(400).json({'Error': 'User is unauthorized'})
      }
      if (!user) {
        //no error but, no user found
        return res.status(500).json({'Error': 'No user found'})
      }

      let hotel = new Hotel({
        name: req.params.name,
        address: req.params.address,
        tripId: req.params._id
      });

      hotel.save()
        .then(hotel => {
          res.status(201).json(hotel)
        })
        .catch(err => {
          if (err) {
            res.status(401).json({'Error': err.message})
          }
        })
    })
  });

};
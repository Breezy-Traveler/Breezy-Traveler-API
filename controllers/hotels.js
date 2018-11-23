// controllers/hotels.js

module.exports = (app) => {

  const Hotel  = require('../models/hotels');
  const User   = require('../models/users');
  const Trip   = require('../models/trips');
  const authorized = require('../src/config/auth');

  // CREATE a hotel
  app.post('/trips/:id/hotels', authorized.required, (req, res) => {

    // const Parent = mongoose.model('Trip')

    User.currentUser(req.token, (err, user) => {
      if (err) {
        // unauthorized
        return res.status(400).json({'Error': 'User is unauthorized'})
      }
      if (!user) {
        //no error but, no user found
        return res.status(500).json({'Error': 'No user found'})
      }

      console.log('\nTHE BODY: ', req.body, '\n')

      Trip.findById(req.params.id, function(err, trip) {
        let hotel = new Hotel({
          name: req.body.name,
          address: req.body.address,
          tripId: req.params.id
        });

        trip.hotels.push(hotel._id);
      // FIXME: Make hotel save into a collection
        trip.save()
          .then(savedTrip => {
            hotel.save()
              .then(savedHotel => {
                res.status(201).json(savedHotel)
              })
              .catch(err => {
                if (err) {
                  res.status(401).json({'Error': err.message})
                }
              })
          })
          .catch(err => {
            if (err) {
              res.status(401).json({'Error': err.message})
            }
          })
      });


    })
  });

};
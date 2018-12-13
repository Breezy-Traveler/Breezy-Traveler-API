// controllers/hotels.js

module.exports = (app) => {

  const Hotel           = require('../models/hotels');
  const User            = require('../models/users');
  const Trip            = require('../models/trips');
  const authorized      = require('../src/config/auth');
  const setCurrentUser  = require('./set-current-user');


  app.get('/trips/:id/hotels', authorized.required, setCurrentUser, function (req, res, next) {
    return res.send("Hello your request is very important to us, please stay on the line.")
  })

  // CREATE a hotel
  app.post('/trips/:id/hotels', authorized.required, setCurrentUser, (req, res) => {

    // const Parent = mongoose.model('Trip')
    // User.currentUser(req.token, (err, user) => {
    //   if (err) {
    //     // unauthorized
    //     return res.status(400).json({'Error': 'User is unauthorized'})
    //   }
    //   if (!user) {
    //     //no error but, no user found
    //     return res.status(500).json({'Error': 'No user found'})
    //   }

      Trip.findById(req.params.id, function(err, trip) {
        let hotel = new Hotel({
          name: req.body.name,
          address: req.body.address,
          tripId: req.params.id
        });

        trip.hotels.push(hotel._id);
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
    // })
  });

};

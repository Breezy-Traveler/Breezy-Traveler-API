// controllers/hotels.js

module.exports = (app) => {

  const Hotel           = require('../models/hotels');
  const User            = require('../models/users');
  const Trip            = require('../models/trips');
  const authorized      = require('../src/config/auth');
  const setCurrentUser  = require('./set-current-user');

  // CREATE a hotel
  // const Parent = mongoose.model('Trip')
  app.post('/trips/:id/hotels', authorized.required, setCurrentUser, (req, res) => {

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
            .then(savedHotel => { res.status(201).json(savedHotel) })
            .catch(err => {
              if (err) { res.status(401).json({'Error': err.message}) }
            })
          })
          .catch(err => {
            if (err) {
              res.status(401).json({'Error': err.message})
            }
          })
      });
  });

  // READ all hotels
  app.get('/trips/:id/hotels', authorized.required, setCurrentUser, function (req, res, next) {
    Trip.findById(req.params.id)
    .then(trip => {
      Hotel.find({tripId: trip._id})
      .then(hotels => {
        res.status(200).json(hotels)
      })
      .catch(err => {
        res.status(401).json({'Error': `${err.message}`})
      })
    })
  });

};

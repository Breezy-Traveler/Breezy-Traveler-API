// controllers/hotels.js
module.exports = (app) => {
  const Hotel = require('../models/hotel');
  const Trip = require('../models/trip');
  const authorized = require('../src/config/auth');
  const setCurrentUser = require('./set-current-user');

  // CREATE a Hotel
  app.post('/trips/:id/hotels', authorized.required, setCurrentUser, (req, res) => {
    Trip.findById(req.params.id, function (err, trip) {
      console.log("Trip: ", trip)
      let hotel = new Hotel({
        name: req.body.name,
        address: req.body.address,
        tripId: req.params.id
      });

      hotel.save()
        .then(savedHotel => {
          trip.hotel_ids.push(savedHotel._id);
          trip.save()
            .then(savedTrip => {
              res.status(201).json(savedHotel)
            })
            .catch(error => {
              if (error) {
                res.status(400).json({
                  error: error.message,
                  debug: 'error updating trip with hotel'
                })
              }
            })
        })
        .catch(err => {
          if (err) {
            res.status(401).json({
              error: err.message,
              debug: 'catch block save hotel'
            })
          }
        })
    });
  });

  // READ all Hotels associated with a Trip
  app.get('/trips/:id/hotels', authorized.required, setCurrentUser, function (req, res, next) {
    Trip.findById(req.params.id)
      .then(trip => {
        Hotel.find({
            tripId: trip._id
          })
          .then(hotels => {
            res.status(200).json(hotels)
          })
          .catch(err => {
            res.status(401).json({
              error: err.message
            })
          })
      })
  });

  // READ one Hotel
  app.get('/trips/:tripId/hotels/:id', authorized.required, setCurrentUser, function (req, res, next) {
    Trip.findById(req.params.tripId)
      .then(trip => {
        if (trip) {
          Hotel.findById(req.params.id)
            .then(hotel => {
              res.status(200).json(hotel)
            })
            .catch(err => {
              res.status(401).json({
                error: err.message
              })
            })
        } else {
          res.status(404).json({
            error: 'No trip found'
          })
        }
      })
  });

  // UPDATE a Hotel
  app.put('/trips/:tripId/hotels/:id', authorized.required, setCurrentUser, (req, res) => {
    Trip.findById(req.params.tripId)
      .then(trip => {
        Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
          })
          .then(updatedHotel => {
            res.status(200).json(updatedHotel);
          })
          .catch(err => {
            res.status(401).json({
              error: err.message
            })
          })
      })
      .catch(err => {
        res.status(401).json({
          error: err.message
        })
      })
  });

  // DELETE Hotel
  app.delete('/trips/:tripId/hotels/:id', authorized.required, setCurrentUser, (req, res) => {
    Trip.findById(req.params.tripId)
      .then(trip => {
        if (trip) {

          // TODO: add the removal of the id from the Trip array
          Hotel.findByIdAndRemove(req.params.id)
            .then(hotel => {
              if (hotel) {
                res.status(202).json()
              } else {
                res.status(400).json({
                  error: 'No hotel found'
                })
              }
            })
            .catch(err => {
              res.status(400).json({
                error: 'No hotel found'
              })
            })

        } else {
          res.status(404).json({
            error: 'No trip found'
          })
        }
      })
      .catch(err => {
        res.status(400).json({
          error: 'Bad request'
        })
      })
  });
};
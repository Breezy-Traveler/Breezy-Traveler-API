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
      let hotel = new Hotel(
        {
          name: req.body.name,
          address: req.body.address,
          tripId: req.params.id
        }
      );
      // console.log("Hotel IDs: ", trip.hotel_ids)

        trip.hotel_ids.unshift(hotel._id);
        trip.save()
          .then(savedTrip => {
            hotel.save()

            .then(savedHotel => { res.status(201).json(savedHotel) })
            .catch(err => {
              if (err) { res.status(401).json({ 'Error': err.message }) }
            })
        })
        .catch(err => {
          if (err) {
            res.status(401).json({ 'Error': err.message })
          }
        })
    });
  });

  // READ all Hotels
  app.get('/trips/:id/hotels', authorized.required, setCurrentUser, function (req, res, next) {
    Trip.findById(req.params.id)
      .then(trip => {
        Hotel.find({ tripId: trip._id })
          .then(hotels => {
            res.status(200).json(hotels)
          })
          .catch(err => {
            res.status(401).json({ 'Error': `${err.message}` })
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
              res.status(401).json({ 'Error': `${err.message}` })
            })
        } else {
          res.status(404).json({ 'Error': 'No trip found' })
        }
      })
  });

  // UPDATE a Hotel
  app.put('/trips/:tripId/hotels/:id', authorized.required, setCurrentUser, (req, res) => {
    Trip.findById(req.params.tripId)
      .then(trip => {
        Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true })
          .then(updatedHotel => {
            res.status(200).json(updatedHotel);
          })
          .catch(err => {
            res.status(401).json({ 'Error': err.message })
          })
      })
      .catch(err => {
        res.status(401).json({ 'Error': err.message })
      })
  });

  // DELETE Hotel
  app.delete('/trips/:tripId/hotels/:id', authorized.required, setCurrentUser, (req, res) => {
    Trip.findById(req.params.tripId)
      .then(trip => {
        if (trip) {

          // TODO add the removal of the id from the Trip array
          Hotel.findByIdAndRemove(req.params.id)
            .then(hotel => {
              if (hotel) {
                res.status(202).json(hotel)
              } else {
                res.status(400).json({ 'Error': 'No hotel found' })
              }
            })
            .catch(err => { res.status(400).json({ 'Error': 'No hotel found' }) })

        } else {
          res.status(404).json({ 'Error': 'No trip found' })
        }
      })
      .catch(err => { res.status(400).json({ 'Error': 'Bad request' }) })
  });
};

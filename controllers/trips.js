// controllers/trips.js

module.exports = (app) => {
  const TripModel = require('../models/trips');
  const trip = {
    isPublic: false,
    place: 'London'
  };

// ROUTES
  app.get('/', (req, res) => {
    res.render('index')
  });

// READ all trips
  app.get('/trips', (req, res) => {
    TripModel.find({}, (err, trips) => {
      res.json({ trips: trips })
    });
  });

// CREATE a Trip
  app.post('/trips', (req, res) => {

    let trip = new TripModel({
      isPublic: req.body.isPublic,
      place: req.body.place,
      hotels: req.body.hotels
    });

    trip.save( (err, trip) => {
      if (err) {
        res.send(err.message)
      } else {
        res.json(trip)
      }
    })
  });
};


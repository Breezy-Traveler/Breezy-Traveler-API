// controllers/trips.js

module.exports = (app) => {
  const TripModel = require('../models/trips');
  const trip = {
    isPublic: false,
    place: 'London'
  };

// ********** ROUTES *********** //
  app.get('/', (req, res) => {
    res.render('index')
  });

// READ all trips
  app.get('/trips', (req, res) => {
    TripModel.find({}, (err, trips) => {
      res.json(trips)
    });
  });

  // SHOW one trip
  app.get('/trips/:id', (req, res) => {
    TripModel.findById(req.params.id)
      .then(trip => {
        res.json(trip)
      }).catch((err) => {
      console.log(`Error: ${err.message}`);
    })
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

  // UPDATE
  app.post('/trips/:id', (req, res) => {
    TripModel.findByIdAndUpdate(req.params.id, req.body)
      .then(trip => {
        res.json(trip);
      })
      .catch((err) => {
        console.log(`Error: ${err.message}`)
      })
  });

  // DELETE Trip
  app.delete('/trips/:id', (req, res) => {
    console.log("Delete trip");
    TripModel.findByIdAndRemove(req.params.id)
      .then((trip) => {
        res.status(200).json(trip);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(400).send(err.message)
      })
  });
};

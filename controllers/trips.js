const express = require('express');
const router = express.Router();
const TripModel = require('../models/trips');

const trip = {
  isPublic: false,
  place: 'London'
};

// const TripSchema = new Schema({
//   createdAt     : { type: Date    },
//   updatedAt     : { type: Date    },
//   isPublic      : { type: Boolean, required: true },
//   place         : { type: String,  required: true  },
//   notes         : { type: String  },
//   coverImageUrl : { type: String  },
//   hotels        : { type: Array   },
//   sites         : { type: Array   },
//   startDate     : { type: Date    },
//   endDate       : { type: Date    }
// });

// ROUTES
router.get('/', (req, res) => {
  res.render('index')
});

// READ all Trips

// READ all trips
router.get('/trips', (req, res) => {
  TripModel.find({}, (err, trips) => {
    res.json({ trips: trips })
  });
});

// CREATE a Trip
router.post('/trips', (req, res) => {

  console.log("yo" + req.body);

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



module.exports = router;
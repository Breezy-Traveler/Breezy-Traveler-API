const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

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
router.get('/trips', (req, res) => {
  Trip.find({}, (err, trips) => {
    res.json({ trips: trips })
  });
});

// CREATE a Trip
router.post('/trips/new', (req, res) => {

  let trip = new Trip(req.body);

  trip.save((err, trip) => {
    res.json({ trips: trip })
  })
});

module.exports = router;
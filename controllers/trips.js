// controllers/trips.js
module.exports = (app) => {

  const Trip = require('../models/trip');
  const Hotel = require('../models/hotel');
  const Site = require('../models/site');
  const authorized = require('../src/config/auth');
  const request = require('request');
  const setCurrentUser = require('./set-current-user');

  // CREATE a Trip
  app.post('/trips', authorized.required, setCurrentUser, (req, res) => {
    let trip = new Trip({
      isPublic: req.body.isPublic,
      place: req.body.place,
      notes: req.body.notes,
      coverImageUrl: req.body.coverImageUrl,
      hotel_ids: req.body.hotel_ids,
      site_ids: req.body.site_ids,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      userId: req.currentUser._id // user set by setCurrerntUser
    });

    trip.save()
      .then(trip => {
        res.status(201).json(trip)
      })
      .catch(err => {
        if (err) {
          res.status(401).json({
            error: err.message,
            debug: 'Route: app.post(/trips)'
          })
        }
      })
  });

  // READ all trips
  app.get('/trips', authorized.required, setCurrentUser, (req, res) => {
    Trip.find({
        userId: req.currentUser._id
      })
      .populate('hotel_ids')
      .populate('site_ids')
      .populate('userId')
      .then(trips => {
        res.status(200).json(trips)
      })
      .catch(err => {
        res.status(401).json({
          error: err.message
        })
      })
  });

  // READ one trip
  app.get('/trips/:id', authorized.required, setCurrentUser, (req, res) => {
    Trip.findById(req.params.id)
      .populate('hotel_ids')
      .populate('site_ids')
      .populate('userId')
      .then(trip => {
        if (!trip) {
          return res.status(404).json({
            error: 'Trip not found'
          })
        }

        res.status(200).json(trip)
      })
      .catch(err => {
        res.status(401).json({
          error: err.message
        })
      })
  });

  // UPDATE a Trip
  app.put('/trips/:id', authorized.required, setCurrentUser, (req, res) => {
    const currUserId = req.currentUser._id
    
    Trip.findById(req.params.id)
      .then(foundTrip => {
        // Check if the trip belongs to the current user
        if (!foundTrip) {
          return res.status(404).json({
            error: "Trip not found"
          })
        }

        if (currUserId.equals(foundTrip.userId)) {
          Trip.findByIdAndUpdate(req.params.id, req.body, {
              new: true

            })
            .then(updatedTrip => {
              const opts = [{
                path: 'hotel_ids'
              }, {
                path: 'site_ids'
              }];

              // Ensures that all hotels and sites get populated into the updated trip
              Trip.populate(updatedTrip, opts, function (err, populatedTrip) {
                res.status(200).json(populatedTrip)
              })
            })
            .catch(err => {
              res.status(401).json({
                error: err.message
              })
            })
        } else {
          res.status(401).json({
            error: "Sorry can't modify this trip"
          })
        }
      })
  });

  // DELETE Trip
  app.delete('/trips/:id', authorized.required, setCurrentUser, (req, res) => {
    const currUserId = req.currentUser._id
    // Check if the trip belongs to the user
    Trip.findOne({
      _id: req.params.id
    }, function (err, foundTrip) {
      if (!foundTrip) {
        return res.status(404).json({
          error: "Trip not found"
        })
      }

      if (currUserId.equals(foundTrip.userId)) {
        foundTrip.remove().then(removedTrip => {
            console.log("Your trip was removed")
            res.status(202).json()
          })
          .catch(err => {
            if (err) {
              res.status(400).json({
                error: err.message,
                debug: "Catch block remove trip"
              })
            }
          })

      } else {
        res.status(401).json({
          error: "Sorry can't delete this trip"
        })
      }
    })
  });

  /*********************** Published Trip *********************/
  // READ public trips
  app.get('/publishedTrips', authorized.required, setCurrentUser, (req, res) => {
    let filter = null
    // is search qurery defined
    const searchTerm = req.query.searchTerm
    const searchLimit = req.query.limit
    let limiter = 0

    // Returns all trips.isPublic where place matches search term
    if (searchTerm) {
      filter = {
        $text: {
          $search: searchTerm
        },
        isPublic: true
      }
    } else if (searchLimit) {
      limiter = parseInt(searchLimit)
      filter = {
        isPublic: true
      }
    } else {
      // No query returns all public trips
      filter = {
        isPublic: true
      }
    }

    Trip.find(filter).limit(limiter)
      .populate('hotel_ids')
      .populate('site_ids')
      .then(trips => {
        res.status(200).json(trips)
      })
      .catch(err => {
        res.status(401).json({
          error: err.message
        })
      })
  });

  /*********************** Getty Images *********************/
  const apiKey = process.env.GETTY_KEY;
  const gettyUrl = 'https://api.gettyimages.com/v3/search/images?phrase=';
  require('querystring');

  app.get('/image-search', (req, res) => {
    // Access the provided 'phrase' query parameter
    let phrase = req.query.phrase.toLowerCase();

    const searchTerm = phrase;
    const options = {
      url: gettyUrl,
      headers: {
        'Api-Key': apiKey
      }
    };

    options.url += searchTerm;
    request(options, (err, response, body) => {
      if (err) {
        res.status(500).json({
          error: err.message
        })
      } else {
        const jsonObj = JSON.parse(body);
        const imgObjs = jsonObj.images;

        let imgArray = []
        imgObjs.forEach((e) => {
          imgArray.push(e.display_sizes[0].uri)
        });

        res.status(200).json(imgArray)
      }
    })
  }); // <--------- End of getty images search
}; // <-------- End of module.exports
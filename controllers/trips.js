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
      hotel_ids: req.body.hotels,
      site_ids: req.body.sites,
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
            'Error': err.message
          })
        }
      })
  });

  // READ all trips
  app.get('/trips', authorized.required, setCurrentUser, (req, res) => {
    Trip.find({
      userId: req.currentUser._id
    })
      .populate('hotels')
      .populate('sites')
      .populate('userId')
      .then(trips => {
        res.status(200).json(trips)
      })
      .catch(err => {
        res.status(401).json({
          'Error': err.message
        })
      })
  });

  // READ one trip
  app.get('/trips/:id', authorized.required, setCurrentUser, (req, res) => {
    Trip.findById(req.params.id)
      .populate('hotels')
      .populate('sites')
      .populate('userId')
      .then(trip => {
        res.status(200).json(trip)
      })
      .catch(err => {
        res.status(401).json({
          'Error': `${err.message}`
        })
      })
  });

  // UPDATE a Trip
  app.put('/trips/:id', authorized.required, setCurrentUser, (req, res) => {
    const currUserId = req.currentUser._id
    // console.log("User ID: ", currUserId)
    // Check if the trip belongs to the user
    Trip.findById(req.params.id)
      .then(foundTrip => {
        // Check if the trip belongs to the current user
        // console.log('UID & Trip UID: ', currUserId, foundTrip)
        if (currUserId.equals(foundTrip.userId)) {
          Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true

          })
            .then(updatedTrip => {
              const opts = [{ path: 'hotels' }, { path: 'sites' }];

              // Ensures that all hotels and sites get populated into the updated trip
              Trip.populate(updatedTrip, opts, function (err, populatedTrip) {
                res.status(200).json(populatedTrip)
              })
            })
            .catch(err => {
              res.status(401).json({
                'Error': err.message
              })
            })
        } else {
          res.status(401).json({
            "Error": "Sorry can't modify this trip"
          })
        }
      })
  });

  // DELETE Trip
  app.delete('/trips/:id', authorized.required, setCurrentUser, (req, res) => {
    const currUserId = req.currentUser._id
    // Check if the trip belongs to the user
    Trip.findById(req.params.id)
      .then(foundTrip => {
        // Validate the trip belongs to the current user
        // console.log('UID & Trip UID: ', currUserId, foundTrip.userId)
        // console.log("Delete Trip hotels: ", foundTrip.hotel_ids)
        if (currUserId.equals(foundTrip.userId)) {
          // Use the hotel_ids to search the hotel collection and remove them
          foundTrip.hotel_ids.forEach(function (hotel_id) {
            Hotel.findByIdAndRemove(hotel_id)
              .then(removedHotel => {
                // console.log('your hotel was removed')
                const opts = [{ path: 'hotels' }, { path: 'sites' }];

                // Ensures that all hotels and sites get populated into the updated trip
                Trip.populate(foundTrip, opts, function (err, populatedTrip) {
                  // console.log(populatedTrip)
                })
                // console.log(removedHotel);
              })
              .catch(err => {
                if (err) {
                  res.status(400).json({
                    'Error': err.message
                  })
                }
              })
          });

          // Use the site_ids to search the site collection and remove them
          foundTrip.site_ids.forEach(function (site_id) {
            Site.findByIdAndRemove(site_id)
              .then(removedSite => {
                // console.log('your site was removed')
                const opts = [{
                  path: 'hotels'
                },
                {
                  path: 'sites'
                }
                ];

                // Ensures that all sites and sites get populated into the updated trip
                Trip.populate(foundTrip, opts, function (err, populatedTrip) {
                  // console.log(populatedTrip)
                })
                // console.log(removedSite);
              })
              .catch(err => {
                if (err) {
                  res.status(400).json({
                    'Error': err.message
                  })
                }
              })
          });


          foundTrip.remove()
            .then(removedTrip => {
              if (removedTrip) {
                console.log('your trip was removed')
                res.status(200).json(removedTrip);
              } else {
                res.status(404).json({
                  'Error': 'Error deleting trip'
                })
              }
            }) // <----- end of then()
            .catch(err => {
              if (err) {
                res.status(400).json({
                  'Error': 'Trip not found'
                })
              }
            })
        } else {
          res.status(401).json({
            'Error': "Sorry can't delete this trip"
          })
        }
      })
  });

  /*********************** Published Trip *********************/
  // READ public trips
  app.get('/publishedTrips', authorized.required, setCurrentUser, (req, res) => {
    var filter = null
    // is search qurery defined
    const searchTerm = req.query.searchTerm
    const searchLimit = req.query.limit
    var limiter = 0

    // Returns all trips.isPublic that place matches search term
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
      // No query return all public trips
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
          'Error': err.message
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
    // console.log('Params: ', phrase);

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
          'Error: ': `${err.message}`
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
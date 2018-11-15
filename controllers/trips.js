// controllers/trips.js

module.exports = (app) => {

  const Trips = require('../models/trips');
  const Users = require('../models/users');
  const authorized = require('../src/config/auth');
  const request = require('request');
  const gettyApi = require("gettyimages-api");

  // ********** ROUTES *********** //
  // app.get('/', (req, res) => {
  //   res.status(401).json({'Error': 'You must be logged in first'})
  // });

  // TODO: Check if the user is authenticated refactor for code reuse
  // const isAuthorized = () => {
  //   Users.currentUser(req.token, (err, user) => {
  // 	  if (err) {
  // 		  // unauthorized
  // 		  return res.status(400).json({'Error': 'User is unauthorized'})
  // 	  }
  // 	  if (!user) {
  // 		  //no error but, no user found
  // 		  return res.status(500).json({'Error': 'No user found'})
  // 	  }
  //   })
  // };

  // READ all trips
  app.get('/trips', authorized.required, (req, res) => {

    Users.currentUser(req.token, (err, user) => {
      if (err) {
        // unauthorized
        return res.status(400).json({'Error': 'User is unauthorized'})
      }
      if (!user) {
        //no error but, no user found
        return res.status(500).json({'Error': 'No user found'})
      }

      Trips.find({userId: user._id})
        .then(trips => {
          res.status(200).json(trips)
        })
        .catch(err => {
          res.status(401).json({'Error': err.message})
        })
    })
  });

  // SHOW one trip
  app.get('/trips/:id', authorized.required, (req, res) => {

    Users.currentUser(req.token, (err, user) => {
      if (err) {
        // unauthorized
        return res.status(400).json({'Error': 'User is unauthorized'})
      }
      if (!user) {
        //no error but, no user found
        return res.status(500).json({'Error': 'No user found'})
      }

      Trips.findById(req.params.id)
        .then(trip => {
          res.status(200).json(trip)
        })
        .catch(err => {
          res.status(401).json({'Error': `${err.message}`})
        })
    })
  });

  // CREATE a Trip
  app.post('/trips', authorized.required, (req, res) => {

    Users.currentUser(req.token, (err, user) => {
      if (err) {
        // unauthorized
        return res.status(400).json({'Error': 'User is unauthorized'})
      }
      if (!user) {
        //no error but, no user found
        return res.status(500).json({'Error': 'No user found'})
      }

      let trip = new Trips({
        isPublic: req.body.isPublic,
        place: req.body.place,
        notes: req.body.notes,
        coverImageUrl: req.body.coverImageUrl,
        hotels: req.body.hotels,
        sites: req.body.sites,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        userId: user._id
      });

      trip.save()
        .then(trip => {
          res.status(201).json(trip)
        })
        .catch(err => {
          if (err) {
            res.status(401).json({'Error': err.message})
          }
        })
    })
  });

  // UPDATE a Trip
  app.put('/trips/:id', authorized.required, (req, res) => {
    Users.currentUser(req.token, (err, user) => {
      if (err) {
        // unauthorized
        return res.status(400).json({'Error': 'User is unauthorized'})
      }
      if (!user) {
        //no error but, no user found
        return res.status(500).json({'Error': 'No user found'})
      }

      Trips.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(updatedTrip => {
          res.status(200).json(updatedTrip);
        })
        .catch(err => {
          res.status(401).json({'Error': err.message})
        })
    })
  });

  // DELETE Trip
  app.delete('/trips/:id', authorized.required, (req, res) => {
    Users.currentUser(req.token, (err, user) => {
      if (err) {
        // unauthorized
        return res.status(400).json({'Error': 'User is unauthorized'})
      }
      if (!user) {
        //no error but, no user found
        return res.status(500).json({'Error': 'No user found'})
      }

      Trips.findByIdAndRemove(req.params.id)
        .then(trip => {
          if (trip) {
            res.status(200).json(trip);
          } else {
            res.status(404).json({'Error': 'No trip found'})
          }
        })
        .catch(err => {
          res.status(400).json({'Error': 'Bad request'})
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
    console.log('Params: ', phrase);

    const searchTerm = phrase;
    const options = {
      url: gettyUrl,
      headers: { 'Api-Key': apiKey }
    };

    options.url += searchTerm;

    request(options, (err, response, body) => {

      if (err) {
        res.status(500).json({'Error: ': `${err.message}`})
      } else {
        const jsonObj = JSON.parse(body);
        res.status(200).json(jsonObj.images)
      }
    })
  });

};

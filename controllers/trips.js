// controllers/trips.js
module.exports = (app) => {

  const Trips = require('../models/trip');
  const Users = require('../models/user');
  const authorized = require('../src/config/auth');
  const request = require('request');
  const setCurrentUser  = require('./set-current-user');

  // CREATE a Trip
  app.post('/trips', authorized.required, setCurrentUser, (req, res) => {

      let trip = new Trips(
        {
          isPublic        : req.body.isPublic,
          place           : req.body.place,
          notes           : req.body.notes,
          coverImageUrl   : req.body.coverImageUrl,
          hotels          : req.body.hotels,
          sites           : req.body.sites,
          startDate       : req.body.startDate,
          endDate         : req.body.endDate,
          userId          : req.currentUser._id // user set by setCurrerntUser
        }
      );

      trip.save()
      .then(trip => { res.status(201).json(trip) })
      .catch(err => {
        if (err) { res.status(401).json({'Error': err.message}) }
      })
  });

  // READ all trips
  app.get('/trips', authorized.required, setCurrentUser, (req, res) => {

      Trips.find({userId: req.currentUser._id})
      .populate('hotels')
      .then(trips => {
        res.status(200).json(trips)
      })
      .catch(err => {
        res.status(401).json({'Error': err.message})
      })
  });

  // READ one trip
  app.get('/trips/:id', authorized.required, setCurrentUser, (req, res) => {

      Trips.findById(req.params.id)
      .populate('hotels')
      .then(trip => {
        res.status(200).json(trip)
      })
      .catch(err => {
        res.status(401).json({'Error': `${err.message}`})
      })
  });

  // UPDATE a Trip
  app.put('/trips/:id', authorized.required, setCurrentUser, (req, res) => {

      Trips.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then(updatedTrip => {
        res.status(200).json(updatedTrip);
      })
      .catch(err => {
        res.status(401).json({'Error': err.message})
      })
  });

  // DELETE Trip
  app.delete('/trips/:id', authorized.required, setCurrentUser, (req, res) => {

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
        const imgObjs = jsonObj.images;

        let imgArray = []
        imgObjs.forEach( (e) => {
          imgArray.push(e.display_sizes[0].uri)
        });

        res.status(200).json(imgArray)
      }
    })
  }); // <--------- End of getty images search
}; // <-------- End of module.exports

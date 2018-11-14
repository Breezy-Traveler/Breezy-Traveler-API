// controllers/trips.js

module.exports = (app) => {

  const Trips = require('../models/trips');
  const Users = require('../models/users');
  const authorized = require('../src/config/auth');


  // ********** ROUTES *********** //
  app.get('/', (req, res) => {
    res.status(401).json({'Error': 'You must be logged in first'})
  });

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

      Trips.find({ userId: user._id })
      .then( trips => {
        res.status(200).json(trips)
      })
      .catch( err => {
        res.status(401).json({ 'Error': err.message })
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
      .then( trip => {
        res.status(200).json(trip)
      })
      .catch( err => {
        res.status(401).json({ 'Error': `${err.message}` })
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
			  hotels: req.body.hotels,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        userId: user._id
		  });

      trip.save()
      .then( trip => {
        res.status(201).json(trip)
      })
      .catch( err => {
        if (err) {
          res.status(401).json({'Error': err.message})
        }
      })
	  })
  });

  // UPDATE a Trip
  app.put('/trips/:id', (req, res) => {
	  Users.currentUser(req.token, (err, user) => {
		  if (err) {
			  // unauthorized
			  return res.status(400).json({'Error': 'User is unauthorized'})
		  }
		  if (!user) {
			  //no error but, no user found
			  return res.status(500).json({'Error': 'No user found'})
		  }

		  Trips.findByIdAndUpdate(req.params.id, req.body)
      .then( trip => {
        res.status(200).json(trip);
      })
      .catch( err => {
        res.status(401).json({ 'Error': err.message })
      })
	  })
  });

  // DELETE Trip
  app.delete('/trips/:id', (req, res) => {
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
      .then( trip => {
        res.status(200).json(trip);
      })
      .catch( err => {
        res.status(400).json({ 'Error': err.message })
      })
    })
  })
};

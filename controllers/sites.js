// controllers/sites.js
module.exports = (app) => {
  const Site            = require('../models/site');
  const Trip            = require('../models/trip');
  const authorized      = require('../src/config/auth');
  const setCurrentUser  = require('./set-current-user');

  // CREATE a Site
  app.post('/trips/:id/sites', authorized.required, setCurrentUser, (req, res) => {
      Trip.findById(req.params.id, function(err, trip) {
        let site = new Site(
          {
            name: req.body.name,
            address: req.body.address,
            tripId: req.params.id
          }
        );
        trip.site_ids.push(site._id);
        trip.save()
          .then(savedTrip => {
            site.save()
            .then(savedSite => { res.status(201).json(savedSite) })
            .catch(err => {
              if (err) { res.status(401).json({'Error': err.message}) }
            })
          })
          .catch(err => {
            if (err) {
              res.status(401).json({'Error': err.message})
            }
          })
      });
  });

  // READ all Sites
  app.get('/trips/:id/sites', authorized.required, setCurrentUser, function (req, res, next) {
    Trip.findById(req.params.id)
    .then(trip => {
      Site.find({tripId: trip._id})
      .then(sites => {
        res.status(200).json(sites)
      })
      .catch(err => {
        res.status(401).json({'Error': `${err.message}`})
      })
    })
  });

  // READ one Site
  app.get('/trips/:tripId/sites/:id', authorized.required, setCurrentUser, function (req, res, next) {
    Trip.findById(req.params.tripId)
    .then(trip => {
      if (trip) {
        Site.findById(req.params.id)
        .then(site => {
          res.status(200).json(site)
        })
        .catch(err => {
          res.status(401).json({'Error': `${err.message}`})
        })
      } else {
        res.status(404).json({'Error': 'No trip found'})
      }
    })
  });

  // UPDATE a Site
  app.put('/trips/:tripId/sites/:id', authorized.required, setCurrentUser, (req, res) => {
      Trip.findById(req.params.tripId)
      .then(trip => {
        Site.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(updatedSite => {
          res.status(200).json(updatedSite);
        })
        .catch(err => {
          res.status(401).json({'Error': err.message})
        })
      })
      .catch(err => {
        res.status(401).json({'Error': err.message})
      })
  });

  // DELETE Site
  app.delete('/trips/:tripId/sites/:id', authorized.required, setCurrentUser, (req, res) => {
      Trip.findById(req.params.tripId)
      .then( trip => {
        if (trip) {

          // TODO add the removal of the id from the Trip array
          Site.findByIdAndRemove(req.params.id)
          .then(site => {
            if (site) {
              res.status(202).json()
            } else {
              res.status(404).json({'Error': 'No site found'})
            }
          })
          .catch(err => { res.status(400).json({'Error': 'No site found'}) })
        } else {
          res.status(404).json({'Error': 'No trip found'})
        }
      })
      .catch(err => { res.status(400).json({'Error': 'Bad request'}) })
  });
};

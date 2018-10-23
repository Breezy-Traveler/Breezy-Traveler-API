module.exports = (app) => {
  const TripSchema = require('../models/trips');

// ROUTES
  app.get('/', (req, res) => {
    res.render('index')
  });
};
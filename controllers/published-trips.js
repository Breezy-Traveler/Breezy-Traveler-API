// controllers/trips.js
module.exports = (app) => {

	const Trips = require('../models/trips');
	const authorized = require('../src/config/auth');
	const setCurrentUser = require('./set-current-user');

	// READ all trips
	app.get('/publishedTrips', authorized.required, setCurrentUser, (req, res) => {

		//no search qurery is defined

		//

		Trips.find({ isPublic: true })
			.populate('hotels')
			.populate('sites')
			.then(trips => {
				res.status(200).json(trips)
			})
			.catch(err => {
				res.status(401).json({ 'Error': err.message })
			})
	});
}; // <-------- End of module.exports

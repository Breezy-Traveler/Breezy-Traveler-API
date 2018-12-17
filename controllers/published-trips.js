// controllers/trips.js
module.exports = (app) => {

	const Trip = require('../models/trips');
	const authorized = require('../src/config/auth');
	const setCurrentUser = require('./set-current-user');

	// READ all trips
	app.get('/publishedTrips', authorized.required, setCurrentUser, (req, res) => {

		var filter = null

		//is search qurery defined
		const searchTerm = req.query.searchTerm
		if (searchTerm) {
			filter = { $text: { $search: searchTerm }, isPublic: true }
		} else {

			//if not, search all
			filter = { isPublic: true }
		}

		Trip.find(filter)
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

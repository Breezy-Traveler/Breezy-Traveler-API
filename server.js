require('dotenv').config();
const exp = require('express');
const app = exp();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const TripModel = require('./models/trips');


// MIDDLEWARE configuration ============================================================
// set up our express application
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json
app.use(bodyParser.json());

// TEMPLATE configuration ===============================================================
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');


// Static content
app.use(exp.static('./public'));


// CONTROLLERS =============================================================================
// load our routes and pass to our app
// const tripsController = require('./controllers/trips');
// app.use('', tripsController);
app.disable('etag');

app.get('/', (req, res) => {
  res.send('awesome')
});

// READ all trips
app.get('/trips', (req, res) => {
  TripModel.find({}, (err, trips) => {
    res.json({ trips: trips })
  });
});

// CREATE a Trip
app.post('/trips', (req, res) => {

  console.log("yo" + req.body);

  let trip = new TripModel({
    isPublic: req.body.isPublic,
    place: req.body.place,
    hotels: req.body.hotels
  });

  trip.save( (err, trip) => {
    if (err) {
      res.send(err.message)
    } else {
      res.json(trip)
    }
  })
});


// Database configuration ==============================================================
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/breezy";
mongoose.Promise = global.Promise;
mongoose.connect(
  mongoUri, { useNewUrlParser: true }, function(error) {
    if (error) {console.log(error.message)}
    else {console.log('connected to mongoose')}
  }
);
mongoose.set('debug', true);



// LAUNCH =============================================================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
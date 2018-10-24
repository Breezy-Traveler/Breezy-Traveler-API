require('dotenv').config();
const exp = require('express');
const app = exp();

const exphbs = require('express-handlebars');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


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


// ROUTES =============================================================================
// load our routes and pass to our app
require('./controllers/trips')(app); // load our routes and pass to our app


// Database configuration ==============================================================
const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI;
mongoose.connect( mongoUri, { useNewUrlParser: true });
mongoose.set('debug', true);


// LAUNCH =============================================================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
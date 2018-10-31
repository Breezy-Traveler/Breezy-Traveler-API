const env = require('dotenv').config();
const exp = require('express');
const app = exp();

const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');

// Database configuration ================================================================
const mongoose = require('mongoose');
const dbConfig = require('./src/config/database');
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.uri, { useNewUrlParser: true }, error => {
  if (error) { console.log(error.message) }
  else { console.log('connected to mongoose') }
});

mongoose.set('debug', true);
require('./src/config/passport')(passport); // pass passport for configuration


// MIDDLEWARE configuration ==============================================================
app.use(morgan('dev'));
app.use(cookieParser()); // read cookies (needed for auth)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// TEMPLATE configuration ================================================================
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');


// Static content
app.use(exp.static('./public'));

// required for passport
app.use(session({
  secret: process.env.SECRET, // session secret
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// CONTROLLERS =============================================================================
// load our routes and pass in our app and fully configured passport
require('./controllers/users')(app, passport);
require('./controllers/trips')(app);


// LAUNCH ==================================================================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
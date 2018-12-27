// server.js

require('dotenv').config();
const exp = require('express');
const app = exp();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const passport = require('passport');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const session = require('express-session');
const dbConfig = require('./src/config/database');


// Database configuration ================================================================
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.uri, { useNewUrlParser: true }, error => {
  if (error) {console.log(`Error connecting: ${error.message}`)}
  else { console.log('connected to mongoose') }
});

mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);
require('./src/config/passport')(passport); // pass passport for configuration


// MIDDLEWARE configuration ==============================================================
app.use(require('morgan')('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true })); // get information from html forms
app.use(bodyParser.json({ limit: '2mb' }));


// TEMPLATE configuration ================================================================
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');


// Static content
app.use(exp.static('./public'));

// required for passport
app.use( session({
  secret: process.env.SECRET, // session secret
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// CONTROLLERS =============================================================================
// load our routes and pass in our app and fully configured passport
require('./controllers/users')(app, passport);
require('./controllers/trips')(app);
require('./controllers/hotels')(app);
require('./controllers/sites')(app);


// LAUNCH ==================================================================================
app.listen(PORT, () => {
  console.log(`\nServer listening on ${PORT}\n`);
});

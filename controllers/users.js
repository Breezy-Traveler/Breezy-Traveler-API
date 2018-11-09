// controllers/users.js

module.exports = (app, passport) => {

  const auth = require('../src/config/auth');


  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================

  app.get('/', function (req, res) {
    res.render('index.hbs'); // load the index.hbs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================

  // SHOW the login form
  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') });
  });
  
	app.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user) {

			if (err) { return next(err); }
			if (!user) { return res.send('no user'); }

			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.json(user);
			});
		})(req, res, next);
	});


  // =====================================
  // SIGNUP ==============================
  // =====================================

  // SHOW the signup form
  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup');
  });

  app.post('/signup', function (req, res, next) {
    passport.authenticate('local-signup', function (err, user) {

      if (err) {
        let foundErr = (err.message).split(' ');
	      let emailError = false;
	      let usernameError = false;

        for (let i = 0; i < foundErr.length; i++) {
          if (foundErr[i] === '`local.email`') {  emailError = true }
          else if (foundErr[i] === '`local.username`') {  usernameError = true }
        }

        if (emailError && usernameError) {
          return res.status(401).json({'Error': 'Email and Username taken'})
        } else if (emailError) {
          return res.status(401).json({'Error': 'Email already taken'})
        } else {
          return res.status(401).json({'Error': 'Username already taken'})
        }
      }

	    res.json(user)
    })(req, res, next);
  });


  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // We will want this protected so you have to be logged in to visit
  // we will use this route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', (req, res) => {
    req.logout(); // provided by passport
    res.redirect('/');
  });
};


// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

// controllers/users.js

module.exports = (app, passport) => {

  const auth = require('../src/config/auth');


  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================

  app.get('/', function (req, res) {
    res.render('index'); // load the index.hbs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================

  // SHOW the login form
  app.get('/login', function(req, res) {
    // render the page
    res.render('login');
  });

	app.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user) {

			if (err) { return next(err); }
			if (!user) { return res.status(401).json({'Error': 'Unauthorized'}); }

			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.status(200).json(user);
			});
		})(req, res, next);
	});


  // =====================================
  // SIGNUP ==============================
  // =====================================

  // SHOW the signup form
  app.get('/signup', function(req, res) {
    // render the page
    res.render('signup');
  });

  app.post('/signup', function (req, res, next) {

  	const username = req.body.username;
	  const email = req.body.email;
	  const password = req.body.password;

  	if (!username && !email && ! password) {
  		return res.status(400).json({'Error': 'Must provide all user credentials'})
	  } else if (!username) {
		  return res.status(400).json({'Error': 'Must provide username'})
	  } else if (!email) {
		  return res.status(400).json({'Error': 'Must provide valid email'})
	  } else if (!password) {
		  return res.status(400).json({'Error': 'Must provide valid password'})
	  }

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

	    res.status(201).json(user)
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

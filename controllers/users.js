// controllers/users.js

module.exports = (app, passport) => {

  // const router = require('express').Router();
  const auth = require('../src/config/auth');
  const Users = require('../models/users');
  // const mongoose = require('mongoose');


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

  // process the login form
  // app.post('/login', do all our passport stuff here)
  app.post('/login', passport.authenticate('local-login', {

      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the login page if there is an error
      failureFlash: true // allow flash messages
  }));


  // =====================================
  // SIGNUP ==============================
  // =====================================

  // SHOW the signup form
  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup', { message: req.flash('signupMessage') });
  });

  app.get('/signup-fail', function(req, res) {
    res.send('nawwwww')
  });

  //POST new user route (optional, everyone has access)
  // app.post('/signup', passport.authenticate('local-signup',
  //   {
	//     failureRedirect : '/signup-fail', // redirect back to the signup page if there is an error
	//     failureFlash    : true // allow flash messages
	//   }), (req, res, next) => {
  //
  //   const user = res.user;
  //
  //   if (!user) {
	//     console.log('in this code block yo')
	//     res.send("Nawwww")
  //   }  else if (user) {
  //
  //     res.json({THEUSER: user})
  //   } else {
	//     next();
  //     console.log('in this code block yo')
  //     res.send("Nawwww")
  //   }
  // });

  app.post('/signup', function (req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {



      if (err) {
	      // console.log(`******************* Info: ${info}`);
        let foundErr = (err.message).split(' ');
        // let emailErr = foundErr.search(`local.email`);
        // let usernameErr = foundErr.search(`local.username`);
	      let emailError = false;
	      let usernameError = false;

        for (let i = 0; i < foundErr.length; i++) {
          // console.log(foundErr[i]);

          if (foundErr[i] === '`local.email`') {
            emailError = true
          } else if (foundErr[i] === '`local.username`') {
	          usernameError = true
          }
        }

        if (emailError && usernameError) {
          return res.status(401).json({'Error': 'Email and Username taken'})
        } else if (emailError) {
          return res.status(401).json({'Error': 'Email already taken'})
        } else {
          return res.status(401).json({'Error': 'Username already taken'})
        }

	      // return res.json({'ValidationFail': err.message})
      }
      // if (!user) { return res.redirect('/signup-fail'); }

	    res.json(user)
    })(req, res, next);
  });


  // process the signup form
  // router.post('/signup', passport.authenticate('local-signup', {
  //   successRedirect : '/profile', // redirect to the secure profile section
  //   failureRedirect : '/signup', // redirect back to the signup page if there is an error
  //   failureFlash    : true // allow flash messages
  // }));


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

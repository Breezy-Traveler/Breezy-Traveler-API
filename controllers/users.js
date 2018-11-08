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

  //POST new user route (optional, everyone has access)
  app.post('/signup', passport.authenticate('local-signup', { failureFlash: true }), (req, res, next) => {

    const user = req.user;

    if (user) {
      res.json({THEUSER: user})
    } else {
      res.send("Nawwww")
    }
    // if(!user.local.email) {
    //   return res.status(422).json({
    //     errors: {
    //       email: 'is required',
    //     },
    //   });
    // }
    //
    // if(!user.password) {
    //   return res.status(422).json({
    //     errors: {
    //       password: 'is required',
    //     },
    //   });
    // }
    //
    // const newUser = new Users();
    // // set the user's local credentials
    // newUser.local.email = req.body.email;
    // newUser.local.password = newUser.generateHash(req.body.password);
    // newUser.local.username = req.body.username;
    // newUser.local.token = newUser.toAuthJSON()
    // // save the user
    //
    // return newUser.save()
    //   .then( (savedUser) => {
    //     res.json({ savedUser });
    //     console.log( savedUser )
    //   });
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

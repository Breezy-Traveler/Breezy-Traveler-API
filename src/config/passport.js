// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../../models/user');

module.exports = function(passport) {
  // required for persistent login sessions
  // passport needs ability to serialize and deserialize users out of session
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, (req, email, password, done) => {
      const newUser = new Users();

      // set the user's local credentials
      newUser.local.email = req.body.email;
      newUser.local.password = newUser.generateHash(req.body.password);
      newUser.local.username = req.body.username;
      newUser.local.token = newUser.toAuthJSON();

      newUser.save()
        .then( (savedUser) => {
          done(null, savedUser)
        })
        .catch( (error) => {
	        return done(error, false);
        });
  }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will add email
      usernameField    : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    }, (req, username, password, done) => {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      Users.findOne({ 'local.username' :  username }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
          return done(err);

        // if no user is found, return the message
        if (!user)s
          return done(null, false);

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
          return done(null, false);

        // all is well, return successful user
        return done(null, user);
      });
    }));
};

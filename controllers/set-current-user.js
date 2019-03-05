// set-curr-user.js
const Users = require('../models/user');

module.exports = (req, res, next) => {
  Users.findOne({ 'local.token': req.token }, (error, user) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!user) {
      return res.status(401).json("Unauthorized")
    }

    req.currentUser = user

    next();
  });
}

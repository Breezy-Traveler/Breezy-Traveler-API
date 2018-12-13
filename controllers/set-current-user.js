// set-curr-user.js
const Users = require('../models/users.js');

module.exports = (req, res, next) => {
  Users.currentUser(req.token, (error, user) => {
    if (error) {
      return res.status(401).send(error)
    }

    if (!user) {
      return res.status(500).send("No user and no error found")
    }

    req.currentUser = user

    next()
  });
}

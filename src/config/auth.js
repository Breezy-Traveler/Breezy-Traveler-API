const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const {
    headers: {
      authorization
    }
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    const tokenValue = authorization.split(' ')[1];
    req.token = tokenValue;
    return tokenValue;
  }
  return null;
};

const auth = {
  required: jwt({
    secret: process.env.SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: process.env.SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;

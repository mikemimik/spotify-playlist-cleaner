'use strict';

module.exports = function authenticateRoute (req, res, next) {
  if (!req.session.isAuthenticated) {
    req.session.notify = {
      type: 'warning',
      message: 'Need to be logged in.'
    };
    return res.redirect('/');
  }
  next();
};

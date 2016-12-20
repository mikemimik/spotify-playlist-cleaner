'use strict';

module.exports = function notification (req, res, next) {
  if (req.session) {
    if (req.session.notify) {
      res.locals.notify = req.session.notify;
      delete req.session.notify;
    }
  }
  next();
};

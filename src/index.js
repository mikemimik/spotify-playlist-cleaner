'use strict';

require('dotenv').load();
require('./spotify-api').initialize();
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const notify = require('../utils/middleware-notify');

let app = express();

// APPLICATION FUNCTION BELOW
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: 'blahblahblah',
    resave: false,
    saveUninitialized: false
    // store: '',
    // cookie: {
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   httpOnly: true
    // }
  })
);
app.use(require('morgan')('dev'));
app.use(notify);
app.use((req, res, next) => {
  // console.log('### TESTING ###');
  // console.log('req.session:', req.session);
  // console.log('url:', req.url);
  // console.log('auth:', req.session.isAuthenticated);
  // console.log('user:', req.session.user);
  // console.log('### END ###');
  res.locals.loggedIn = req.session.isAuthenticated;
  res.locals.currentUrl = req.url;
  res.locals.user = req.session.user || {};
  next();
});
app.use('/', require('../routes/index'));
app.use('/search', require('../routes/search'));
app.use('/logout', require('../routes/logout'));
app.use('/user', require('../routes/user'));
app.use('/callback', require('../routes/callback'));
app.use('/authorize', require('../routes/authorize'));
app.listen(process.env.PORT, () => {
  console.log(`App Listening on port ${process.env.PORT}...`);
});

'use strict';

const spotify = require('../src/spotify-api');
const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    // TODO: check the '/' root to make sure this is actually resetting stuff
    // TODO: find out if I need to re-initialize spotifyWebApi
    spotify.WebApi.resetCredentials();
    spotify.initialize();
    req.session.destroy((err) => {
      if (err) { console.log(err); }
      res.redirect('/');
    });
  })
  .post((req, res, next) => {
    // removed user from post data
  });

module.exports = router;

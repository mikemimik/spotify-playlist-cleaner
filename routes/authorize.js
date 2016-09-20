'use strict';

const express = require('express');
const router = express.Router();
const spotify = require('../src/spotify-api');

router.route('/')
  .get((req, res, next) => {
    let authorizeURL = spotify.WebApi.createAuthorizeURL(spotify.scope, spotify.state);
    res.redirect(authorizeURL);
  });

module.exports = router;

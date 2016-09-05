'use strict';
const express = require('express');
const router = express.Router();
const Config = require('../config');
const AppState = require('../src/state');

router.route('/')
  .get((req, res, next) => {
    let authorizeURL = AppState.spotifyWebApi.createAuthorizeURL(
      Config.scopes,
      Config.state
    );
    res.redirect(authorizeURL);
  });

module.exports = router;

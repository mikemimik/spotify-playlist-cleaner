'use strict';
const AppState = require('../src/state');
const express = require('express');
const Config = require('../config');
const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    let authorizeURL = AppState.spotifyWebApi.createAuthorizeURL(
      Config.scopes,
      Config.state
    );
    res.redirect(authorizeURL);
  });

module.exports = router;

'use strict';
const express = require('express');
const router = express.Router();
const AppState = require('../src/state');

router.route('/')
  .get((req, res, next) => {
    // TODO: check the '/' root to make sure this is actually resetting stuff
    // TODO: find out if I need to re-initialize spotifyWebApi
    AppState.spotifyWebApi.resetCredentials();
    AppState.render = {};
    res.redirect('/');
  })
  .post((req, res, next) => {
    // removed user from post data
  });

module.exports = router;

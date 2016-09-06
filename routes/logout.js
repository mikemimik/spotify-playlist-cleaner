'use strict';
const AppState = require('../src/state');
const express = require('express');
const Helpers = require('../src/helpers');
const router = express.Router();

router.route('/')
  .all((req, res, next) => {
    AppState.render.currentUrl = '/';
    next();
  })
  .get((req, res, next) => {
    // TODO: check the '/' root to make sure this is actually resetting stuff
    // TODO: find out if I need to re-initialize spotifyWebApi
    AppState.spotifyWebApi.resetCredentials();
    Helpers.initialize(AppState);
    AppState.render = {};
    res.redirect('/');
  })
  .post((req, res, next) => {
    // removed user from post data
  });

module.exports = router;

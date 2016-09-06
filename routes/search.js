'use strict';
const AppState = require('../src/state');
const Handlers = require('../handlers');
const express = require('express');
const Helpers = require('./helpers');
const router = express.Router();

router.route('/')
  .all((req, res, next) => {
    // check app state
    if (AppState.render.user) {
      AppState.render.currentUrl = '/search';
      next();
    } else {
      AppState.render.currentUrl = '/';
      AppState.render.error = {
        message: 'Need to be logged in!'
      };
      res.redirect('/');
    }
  })
  .get((req, res, next) => {
    res.render(
      'search',
      AppState.render,
      Helpers.renderView.bind(this, res, AppState)
    );
  })
  .post((req, res, next) => {
    console.log('received POST to /search'); // TESTING
    // console.log('body:', req.body); // TESTING
    // let search = req.body.searchInput;
    AppState.spotifyWebApi.getUserPlaylists(AppState.render.user.id)
      .then((data) => {
        // console.log(data.body.items); // TESTING
        AppState.render.playlists = Helpers.createPlaylistItems(data.body.items);
        res.render(
          'results',
          AppState.render,
          Helpers.renderView.bind(this, res, AppState)
        );
      })
      .catch(Handlers.error);
  });

module.exports = router;

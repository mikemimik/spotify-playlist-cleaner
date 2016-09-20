'use strict';

const requireAuth = require('../utils/middleware-auth');
const Handlers = require('../handlers');
const express = require('express');
const spotify = require('../src/spotify-api');
const Helpers = require('./helpers');
const router = express.Router();

router.route('/')
  .get(requireAuth)
  .get((req, res, next) => {
    res.render('search');
  })
  .post((req, res, next) => {
    // console.log('body:', req.body); // TESTING
    // let search = req.body.searchInput;
    spotify.WebApi.getUserPlaylists(req.session.user.id)
      .then((data) => {
        // console.log(data.body.items); // TESTING
        res.locals.playlists = Helpers.createPlaylistItems(data.body.items);
        spotify.WebApi.resetAccessToken();
        res.render('results');
      })
      .catch(Handlers.error);
  });

module.exports = router;

'use strict';

const requireAuth = require('../../utils/middleware-auth');
const express = require('express');
const RouteHelpers = require('../helpers');
const spotify = require('../../src/spotify-api');
const router = express.Router();

const playlists = require('./playlists');
const tracks = require('./tracks');

// INFO: shows the user's profile
router.route('/:userId')
  .all(requireAuth)
  .get((req, res, next) => {
    RouteHelpers.LogRouteInput(req);
    res.render('profile');
  });

// TODO: turn each method into function inside playlists.js
// router.use('/:userId/playlists', require('./playlists'));
router.route('/:userId/playlists')
  .all(requireAuth)
  .get(playlists.get);

router.route('/:userId/playlists/:playlistId/tracks')
  .all(requireAuth)
  .get(tracks.get);

router.route('/:userId/playlists/:playlistId/filter')
  .all(requireAuth);

module.exports = router;
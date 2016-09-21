'use strict';

const express = require('express');
const spotify = require('../src/spotify-api');
const router = express.Router();
const Helpers = require('./helpers');

router.route('/spotify')
  .get((req, res, next) => {
    spotify.WebApi.getUserPlaylists('spotify')
      .then((data) => {
        // console.log(data.body); // TESTING
        // href -> link to current list of playlists
        // items -> array of objects
        // limit -> number of objects in `items`
        // next -> link to next set of playlists
        // offset -> starting index for `items`
        // previous -> link to previous set of playlists
        // total -> total number of playlist items
        res.locals.pageTitle = 'Spotify Playlists';
        res.locals.playlists = Helpers.createPlaylistItems(data.body.items);
        console.log(res.locals.playlists[0]);
        res.locals.playlists = res.locals.playlists.map((playlist) => {
          return playlist.render();
        });
        res.render('playlist');
      })
      .catch((err) => {
        console.log('encountered error:', err);
        res.status(400).end();
      });
  });

router.route('/self')
  .get((req, res, next) => {
    res.render('playlist');
  });

module.exports = router;

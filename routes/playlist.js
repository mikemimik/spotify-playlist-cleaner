'use strict';

const requireAuth = require('../utils/middleware-auth');
const express = require('express');
const spotify = require('../src/spotify-api');
const router = express.Router();
const Helpers = require('./helpers');
const _ = require('lodash');

function generalCatch (err, req, res) {
  console.log('encountered error:', err);
  res.status(400).end();
}

function getDisplayPlaylists (data, req, res) {
  console.log(data.body); // TESTING
  // href -> link to current list of playlists
  // items -> array of objects
  // limit -> number of objects in `items`
  // next -> link to next set of playlists
  // offset -> starting index for `items`
  // previous -> link to previous set of playlists
  // total -> total number of playlist items
  res.locals.pageTitle = (req.url === '/self')
    ? req.session.user.id + '\'s playlists'
    : 'Spotify\' Playlists';
  let playlists = Helpers.createPlaylistItems(data.body.items);
  res.locals.playlists = playlists.map(playlist => playlist.render());
  res.render('playlist');
}

router.route('/spotify')
  .all(requireAuth)
  .get((req, res, next) => {
    spotify.WebApi.getUserPlaylists('spotify')
      .then(_.bind(getDisplayPlaylists, this, _, req, res))
      .catch(_.bind(generalCatch, this, _, req, res));
  });

router.route('/self')
  .all(requireAuth)
  .get((req, res, next) => {
    console.log('GET - this:', this);
    spotify.WebApi.getUserPlaylists(req.session.user.id)
      .then(_.bind(getDisplayPlaylists, this, _, req, res))
      .catch(_.bind(generalCatch, this, _, req, res));
  });

router.param('playlist_id', (req, res, next, id) => {
  // TODO: put the track object on the req
  let userId = req.url.split('/')[1];
  if (userId === 'spotify' || userId === req.session.user.id) {
    spotify.WebApi.getPlaylist(userId, id)
      .then((data) => {
        // TODO: attach them to the playlist object?
        // TODO: render them in a userful way?
        req.playlistData = data.body;
        req.tracks = Helpers.createTrackItems(data.body.tracks.items);
        next();
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          req.session.notify = {
            type: 'danger',
            message: 'Error finding playlist tracks.'
          };
          res.redirect('/');
        }
      });
  } else {
    req.session.notify = {
      type: 'warning',
      message: 'Invalid id given for playlist.'
    };
    res.redirect('/');
  }
});

router.route('/*/:playlist_id/tracks')
  .all(requireAuth)
  .get((req, res, next) => {
    // INFO: making assumption req.tracks exists (because of param route)
    res.locals.tracks = req.tracks;
    res.locals.playlist_id = req.params.playlist_id;
    res.render('tracks');
    // console.log('### TESTING - /*/tracks/:track_id ###'); // TESTING
    // console.log('user:', req.session.user); // TESTING
    // console.log('url:', req.url); // TESTING
    // console.log('baseUrl:', req.baseUrl); // TESTING
    // console.log('for:', req.url.split('/')[1]); // TESTING
    // console.log('### END ###'); // TESTING
    // res.redirect('/playlist/spotify');
  });

router.route('/filter')
  .all(requireAuth)
  .get((req, res, next) => {
    console.log(req.query); // TESTING
    if (req.query.owner === 'spotify' || req.query.owner === req.session.user.id) {
      let filteredPlaylist = {};
      spotify.WebApi.getPlaylist(req.query.owner, req.query.playlist)
        .then((data) => {
          console.log('got data'); // TESTING
          filteredPlaylist.name = data.body.name;
          filteredPlaylist.from_snapshot_id = data.body.snapshot_id;
          filteredPlaylist.public = false;
          // TODO: handle case where tracks are paginated
          filteredPlaylist.tracks = data.body.tracks.items
            .filter(item => !item.track.explicit)
            .map(item => item.track.uri);
          // TODO: check if filtered playlist exists already
          // TODO: create new playlist
          return spotify.WebApi.createPlaylist(
            req.session.user.id,
            filteredPlaylist.name,
            { public: false }
          );
        })
        .then((data) => {
          console.log('playst created'); // TESTING
          filteredPlaylist.id = data.body.id;
          // TODO: add tracks to playlist
          return spotify.WebApi.addTracksToPlaylist(
            req.session.user.id,
            filteredPlaylist.id,
            filteredPlaylist.tracks
          );
        })
        .then((data) => {
          console.log('filtered tracks added to playlist'); // TESTING
          console.log(data); // TESTING
          filteredPlaylist.snapshot_id = data.body.snapshot_id;
          return spotify.WebApi.changePlaylistDetails(
            req.session.user.id,
            filteredPlaylist.id,
            { description: 'snapshot_id:' + filteredPlaylist.snapshot_id }
          );
        })
        .then((data) => {
          console.log('changed playlist details'); // TESTING
          console.log(data);
          res.redirect('/playlist/self');
        })
        .catch(_.bind(generalCatch, this, _, req, res));
    } else {
      console.log('bad owner'); // TESTING
      req.session.notify = {
        type: 'warning',
        message: 'Invalid owner given.'
      };
      res.redirect('/');
    }
  })
  .post((req, res, next) => {
    console.log(req.params);
    console.log(req.query);
    res.render('index');
  });

module.exports = router;

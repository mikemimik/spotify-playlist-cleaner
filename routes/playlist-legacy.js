'use strict';

const requireAuth = require('../utils/middleware-auth');
const express = require('express');
const spotify = require('../src/spotify-api');
const router = express.Router();
const Helpers = require('./helpers');
const _ = require('lodash');

function generalCatch (err) {
  console.log('Caught an error:', err);
  this.res.status(400).end();
}

function setLocals (data) {
  this.res.locals.userId = this.req.params.userId;
  this.res.locals.navigation = { next: null, previous: null };
  this.res.locals.pageTitle = this.req.session.user.id + '\'s Playlists';
  return this;
  // this.res.render('playlist-list');
}

function renderRoute (data) {
  this.res.render(data);
}

function createPlaylistItems (data) {
  // console.log(data.body); // TESTING
  // href -> link to current list of playlists
  // items -> array of objects
  // limit -> number of objects in `items`
  // next -> link to next set of playlists
  // offset -> starting index for `items`
  // previous -> link to previous set of playlists
  // total -> total number of playlist items
  let promise = new Promise((resolve, reject) => {
    let playlists = Helpers.createPlaylistItems(data.body.items);
    this.res.locals.playlists = playlists.map(playlist => playlist.render());
    return resolve(this);
  });
  return promise;
}

// function getUserPlaylists () {
//   let promise = new Promise((resolve, reject) => {
//     spotify.WebApi.getUserPlaylists(this.req.session.user.id)
//       .then()
//       .catch();
//   });
//   return promise;
// }

function createPagination () {
  let promise = new Promise((resolve, reject) => {

  });
  return promise;
}

router.route('/:userId')
  .all(requireAuth)
  .get((req, res, next) => {
    console.log('params:', req.params);
    console.log('query:', req.query);
    console.log('body:', req.body);

    // TODO: collect route data
    let context = { req: req, res: res };
    let offset = 0;
    if (req.query.page) {
      let page = parseInt(req.query.page, 10);
      offset = (page - 1) * 20;
    }
    // TODO: make API request
    spotify.WebApi.getUserPlaylists(req.params.userId, { offset: offset })
      // TODO: deal with API response data
      .then(createPlaylistItems.bind(context))
      // TODO: sort out pagination
      .then(createPagination.bind(context))
      // TODO: set locals data
      .then(setLocals.bind(context))
      // TODO: render route
      .then(renderRoute.bind(context))
      .catch(generalCatch.bind(context));
  });

router.route('/:userId/:playlistId')
  .get((req, res, next) => {
    console.log('playlist id:', req.params.playlistId);
    next();
  });

router.route('/*/:playlistId/tracks')
  .all(requireAuth)
  .get((req, res, next) => {
    // console.log('### TESTING - /*/tracks/:track_id ###'); // TESTING
    // console.log('user:', req.session.user); // TESTING
    // console.log('url:', req.url); // TESTING
    // console.log('baseUrl:', req.baseUrl); // TESTING
    // console.log('for:', req.url.split('/')[1]); // TESTING
    // console.log('### END ###'); // TESTING
    let userId = req.url.split('/')[1];
    spotify.WebApi.getPlaylist(userId, req.params.playlistId)
      .then((data) => {
        // TODO: attach them to the playlist object?
        // TODO: render them in a userful way?
        console.log(data.body); // TESTING
        // res.locals.playlistData = data.body;
        res.locals.tracks = Helpers.createTrackItems(data.body.tracks.items);
        res.locals.playlist = { id: req.params.playlistId };
        res.render('tracks');
      }).catch((err) => {
        if (err) {
          console.log(err);
          req.session.notify = {
            type: 'danger',
            message: 'Error finding playlist tracks.'
          };
          res.redirect('/');
        }
      });
  });

router.route('/filter/:playlistId')
  .post((req, res, next) => {
    console.log('params:', req.params);
    console.log('query:', req.query);
    console.log('body:', req.body);
    res.render('index');
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
  });

module.exports = router;

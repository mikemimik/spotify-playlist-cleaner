'use strict';

const RouteHelpers = require('../helpers');
const spotify = require('../../src/spotify-api');
const Models = require('../../models');

module.exports.get = function getPlaylistTracks (req, res, next) {
  RouteHelpers.LogRouteInput(req);
  let context = { req: req, res: res };
  spotify.WebApi.getPlaylist(req.params.userId, req.params.playlistId)
    .then(createTrackViewItems.bind(context))
    .then(setLocals)
    .then(renderRoute)
    .catch(generalCatch);
};

function createTrackViewItems (data) {
  let context = this;
  let promise = new Promise((resolve, reject) => {
    let tracks = data.body.tracks.items.map((item, index) => {
      return new Models.Track(item.track, index);
    });
    context.res.locals.tracks = tracks;
    context.res.locals.playlist = { id: context.req.params.playlistId };
    return resolve(context);
  });
  return promise;
}

function setLocals (context) {
  console.log('setLocals function:', Object.keys(context));
  let promise = new Promise((resolve, reject) => {
    context.res.locals.userId = context.req.params.userId;
    context.res.locals.navigation = { next: null, previous: null };
    context.res.locals.pageTitle = context.req.session.user.id + '\'s Playlists';
    return resolve(context);
  })
  .catch((data) => reject(data));
  return promise;
}

function renderRoute (context) {
  console.log('render function:', Object.keys(context));
  return context.res.render('tracks', context.locals);
}

function generalCatch (err) {
  console.log('Caught an error:', err);
  this.res.status(400).end();
}
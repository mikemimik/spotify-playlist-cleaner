'use strict';

const RouteHelpers = require('../helpers');
const Bluebird = require('bluebird');
const spotify = require('../../src/spotify-api');
const Models = require('../../models');

module.exports.get = function getPlaylists (req, res, next) {
  RouteHelpers.LogRouteInput(req);
  let context = { req: req, res: res };
  let offset = 0;
  spotify.WebApi.getUserPlaylists(req.params.userId, { offset: offset })
    .then(createPlaylistViewItems.bind(context))
    // .then(createPagination.bind(context))
    .then(setLocals)
    .then(renderRoute)
    .catch(generalCatch);
}

function createPlaylistViewItems (data) {
  let context = this;
  let promise = new Promise((resolve, reject) => {
    Bluebird.map(data.body.items, getPlaylistDetails)
      .then((playlists) => {
        context.res.locals.playlists = playlists.map((playlist) => playlist.render());
        return resolve(context);
      })
      .catch((data) => reject(data));
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
  return context.res.render('playlists', context.locals);
}

function createPagination () {
 let promise = new Promise((resolve, reject) => {

 });
 return promise;
}

function getPlaylistDetails (item) {
  let promise = new Promise((resolve, reject) => {
    let playlist = new Models.Playlist(item);
    spotify.WebApi.getPlaylist(item.owner.id, item.id)
      .then(function (data) {
        let details = data.body;
        if (details.description) {
          playlist.setDescription(details.description);
          let hasSnapshot = details.description.indexOf('snapshot_id:');
          if (hasSnapshot !== -1) {
            let snapshotId = details.description.split(':')[1];
            playlist.isFiltered(true);
            return resolve(playlist);
          } else {
            return resolve(playlist);
          }
        }
        return resolve(playlist);
      })
      .catch((data) => reject(data));
  });
  return promise;
}

function generalCatch (err) {
  console.log('Caught an error:', err);
  this.res.status(400).end();
}
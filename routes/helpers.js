'use strict';
const Handlers = require('../handlers');
const Playlist = require('../models/playlist');

module.exports.createPlaylistItems = function createPlaylistItems (items) {
  let playlists = [];
  items.forEach((item) => {
    playlists.push(new Playlist(item).render());
  });
  return playlists;
};

module.exports.renderView = function renderView (res, state, err, html) {
  if (err) { Handlers.error.call(err); }
  if (state.render.notification) {
    delete state.render.notification;
  }
  res.send(html);
};

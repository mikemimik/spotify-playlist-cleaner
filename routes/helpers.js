'use strict';

const Playlist = require('../models/playlist');

module.exports.createPlaylistItems = function createPlaylistItems (items) {
  let playlists = [];
  items.forEach((item) => {
    playlists.push(new Playlist(item));
  });
  return playlists;
};

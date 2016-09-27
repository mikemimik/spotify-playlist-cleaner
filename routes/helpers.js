'use strict';

const Models = require('../models');

module.exports.createPlaylistItems = function createPlaylistItems (items) {
  return items.map((item) => {
    return new Models.Playlist(item);
  });
};

module.exports.createTrackItems = function createTrackItems (items) {
  return items.map((item, index) => {
    return new Models.Track(item.track, index);
  });
};

module.exports.createPaginationObj = function createPaginationObj () {

};

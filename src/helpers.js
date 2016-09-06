'use strict';
const Config = require('../config');

module.exports.initialize = function initialize (AppState) {
  AppState.spotifyWebApi.setClientId(Config.clientId);
  AppState.spotifyWebApi.setClientSecret(Config.clientSecret);
  AppState.spotifyWebApi.setRedirectURI(Config.redirectUri);
  return AppState;
};

'use strict';

const SpotifyWebApi = require('spotify-web-api-node');

let spotifyWebApi = new SpotifyWebApi();

function initialize () {
  spotifyWebApi.setClientId(process.env.CLIENT_ID);
  spotifyWebApi.setClientSecret(process.env.CLIENT_SECRET);
  spotifyWebApi.setRedirectURI(process.env.REDIRECT_URI);
}

module.exports = {
  WebApi: spotifyWebApi,
  initialize: initialize,
  scope: [
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'user-library-read',
    'user-library-modify'
  ],
  state: 'some-secret-cat-formula',
  store: {
    token: {
      expires: '',
      access: '',
      refresh: ''
    },
    authenticated: false
  }
};

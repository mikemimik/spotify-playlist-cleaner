'use strict';

const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const Config = require('./config');
const express = require('express');
const AppState = require('./src/state');

let spotifyWebApi = new SpotifyWebApi();
AppState.spotifyWebApi = spotifyWebApi;
let app = express();

function initialize () {
  spotifyWebApi.setClientId(Config.clientId);
  spotifyWebApi.setClientSecret(Config.clientSecret);
  spotifyWebApi.setRedirectURI(Config.redirectUri);
}

// APPLICATION FUNCTION BELOW
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', require('./routes/root'));
app.use('/authorize', require('./routes/authorize'));
app.use('/callback', require('./routes/callback'));
app.use('/search', require('./routes/search'));
app.use('/logout', require('./routes/logout'));
app.use('/profile', require('./routes/profile'));
initialize();
app.listen(8080, () => {
  console.log('app listening');
});

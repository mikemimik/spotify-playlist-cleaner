'use strict';

const Handlers = require('../handlers');
const express = require('express');
const router = express.Router();
const spotify = require('../src/spotify-api');

router.route('/auth')
  .get((req, res, next) => {
    // console.log(req.session); // TESTING
    let authCode = req.query.code;
    let checkState = req.query.state;
    if (checkState === spotify.state) {
      spotify.WebApi.authorizationCodeGrant(authCode)
        .then((data) => {
          // TODO: are these 3 lines needed?
          spotify.store.token.expires = data.body['expires_in'];
          spotify.store.token.access = data.body['access_token'];
          spotify.store.token.refresh = data.body['refresh_token'];
          spotify.WebApi.setAccessToken(spotify.store.token.access);
          spotify.WebApi.setRefreshToken(spotify.store.token.refresh);
          req.session.isAuthenticated = true;
          spotify.store.authenticated = true;
          return spotify.WebApi.getMe();
        })
        .then((data) => {
          // TODO: create user profile
          let user = {
            id: data.body.id,
            name: data.body.display_name ? data.body.display_name : data.body.id
          };
          if (req.session) {
            console.log('req.session is truthy');
          } else {
            console.log('req.session is falsy');
          }
          req.session.user = user;
          res.redirect('/');
        })
        .catch(Handlers.error);
    } else {
      // invalid return
      res.status(400).end();
    }
  });

module.exports = router;

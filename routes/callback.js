'use strict';
const AppState = require('../src/state');
const Handlers = require('../handlers');
const express = require('express');
const Helpers = require('./helpers');
const Config = require('../config');
const router = express.Router();

router.route('/')
  .all((req, res, next) => {
    AppState.render.currentUrl = '/';
    next();
  })
  .post((req, res, next) => {
    console.log('received POST to /callback'); // TESTING
    res.render(
      'index',
      AppState.render,
      Helpers.renderView(this, res, AppState)
    );
  })
  .get((req, res, next) => {
    console.log('received GET to /callback'); // TESTING
    let authCode = req.query.code;
    let checkState = req.query.state;
    if (checkState === Config.state) {
      AppState.spotifyWebApi.authorizationCodeGrant(authCode)
        .then((data) => {
          AppState.token.expires = data.body['expires_in'];
          AppState.token.access = data.body['access_token'];
          AppState.token.refresh = data.body['refresh_token'];
          AppState.spotifyWebApi.setAccessToken(AppState.token.access);
          AppState.spotifyWebApi.setRefreshToken(AppState.token.refresh);
          AppState.render.authorized = true;
          return AppState.spotifyWebApi.getMe();
        })
        .then((data) => {
          let user = {
            id: data.body.id,
            name: data.body.display_name ? data.body.display_name : data.body.id
          };
          AppState.render.user = user;
          res.render(
            'index',
            AppState.render,
            Helpers.renderView(this, res, AppState)
          );
        })
        .catch(Handlers.error);
    } else {
      // invalid return
      res.status(400).end();
    }
  });

module.exports = router;

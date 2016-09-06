'use strict';
const AppState = require('../src/state');
const Handlers = require('../handlers');
const express = require('express');
const router = express.Router();

router.route('/')
  .all((req, res, next) => {
    AppState.render.currentUrl = '/profile';
    next();
  })
  .get((req, res, next) => {
    AppState.spotifyWebApi.getMe()
      .then((data) => {
        // console.log(data); // TESTING
        let user = {
          name: data.body.id
        };
        AppState.render.user = user;
        res.render('profile', AppState.render);
      })
      .catch(Handlers.error);
  });

module.exports = router;

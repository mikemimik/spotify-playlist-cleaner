'use strict';
const express = require('express');
const router = express.Router();
const AppState = require('../src/state');
const Handlers = require('../handlers');

router.route('/')
  .all((req, res, next) => {
    // check app state
    if (AppState.render.user) {
      next();
    } else {
      res.redirect('/');
    }
  })
  .get((req, res, next) => {
    res.render('search', AppState.render);
  })
  .post((req, res, next) => {
    console.log('received POST to /search');
    console.log('body:', req.body);
    let search = req.body.searchInput;
    AppState.spotifyWebApi.getUserPlaylists(AppState.render.user.id)
      .then((data) => {
        console.log(data.body.items);
        res.render('results', AppState.render);
      })
      .catch(Handlers.error);
  });

module.exports = router;

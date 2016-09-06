'use strict';
const AppState = require('../src/state');
const express = require('express');
const router = express.Router();

router.route('/')
  .all((req, res, next) => {
    AppState.render.currentUrl = '/';
    next();
  })
  .get((req, res, next) => {
    res.render('index', AppState.render);
  });

module.exports = router;

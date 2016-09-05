'use strict';
const express = require('express');
const router = express.Router();
const AppState = require('../src/state');

router.route('/')
  .get((req, res, next) => {
    res.render('index', AppState.render);
  });

module.exports = router;

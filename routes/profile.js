'use strict';

const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    res.render('profile');
  });

module.exports = router;

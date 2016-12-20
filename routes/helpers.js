// FILE: RouteHelper
'use strict';

module.exports.createPaginationObj = function createPaginationObj () {

};

module.exports.LogRouteInput = function LogRouteInput (req) {
  console.log('params:', req.params);
  console.log('query:', req.query);
  console.log('body:', req.body);
};
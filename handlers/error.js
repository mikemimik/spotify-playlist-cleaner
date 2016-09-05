'use strict';

const handlers = {
  defaultHandler: function defaultHandler (err) {
    console.log('encountered error:', err);
  }
};

function errorDelegate (err) {
  // TODO: check type of error
  // TODO: return correct delegate function to handle error
  let handler = handlers['defaultHandler'];
  return handler(err);
}

module.exports = errorDelegate;

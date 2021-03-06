'use strict';

const Path = require('path');
const Fs = require('fs');

let files = Fs.readdirSync(__dirname, 'utf8');
files.forEach((file) => {
  let splitFile = file.split('.');
  let filename = file.split('.')[0];
  let extension = splitFile[splitFile.length - 1];
  if (extension === 'js' && filename !== 'index') {
    let letters = filename.split('');
    letters[0] = letters[0].toUpperCase();
    filename = letters.join('');
    module.exports[filename] = require(Path.join(__dirname, file));
  }
});

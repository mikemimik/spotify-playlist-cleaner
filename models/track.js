'use strict';

const moment = require('moment');

class Track {
  constructor (data, order) {
    this.id = data.id;
    this.name = data.name;
    this.duration = getDuration(data.duration_ms);
    this.explicit = data.explicit;
    this.artist = createArtistName(data.artists);
    this.album = data.album.name;
    this.pos = order + 1;
    // this.popularity = data.popularity;
  }

  render () {
    return {

    };
  }
}

function getDuration (time) {
  let duration = moment.duration(time).asMinutes();
  let minutes = duration.toString().split('.')[0];
  let seconds = moment
    .duration(duration - minutes, 'minutes')
    .asSeconds()
    .toString().split('.')[0];
  return {
    min: minutes,
    sec: seconds
  };
}

function createArtistName (data) {
  if (data.length > 1) {
    return data.reduce((prev, curr, index) => {
      if (prev.name) {
        return prev.name + ', ' + curr.name;
      } else {
        return prev + ', ' + curr.name;
      }
    });
  } else {
    return data[0].name;
  }
}

module.exports = Track;

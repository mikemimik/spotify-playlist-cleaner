'use strict';

class Playlist {
  constructor (data) {
    this.id = data.id;
    this.images = data.images;
    this.name = data.name;
    this.owner = data.owner;
    this.snapshot_id = data.snapshot_id;
    this.tracks = data.tracks;
    this.type = data.type;

    this.filtered = false;
    this.description = null;
  }

  render () {
    return {
      id: this.id,
      name: this.name,
      listTracks: this.tracks.href,
      numTracks: this.tracks.total,
      img: this.images[0].url,
      owner: this.owner.id
    };
  }

  setDescription(description) {
    this.description = description;
  }

  isFiltered(input) {
    if (input === undefined) {
      return this.filtered;
    } else {
      if (input === true || input === false) {
        this.filtered = input;
      }
    }
  }
}

module.exports = Playlist;

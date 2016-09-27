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
}

module.exports = Playlist;

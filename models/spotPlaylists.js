const { Schema, model, models } = require('mongoose');

const spotTracksSchema = new Schema({
    track_id: { type: String, trim: true },
    track_title: { type: String, trim: true },
    album_id: { type: String, trim: true },
    album_name: { type: String, trim: true },
    album_img: { type: String, trim: true },
    year: { type: String, trim: true },
    artist_id: { type: String, trim: true },
    artist_name: { type: String, trim: true },
    artist_img: { type: String, trim: true },
    preview_url: { type: String, trim: true },
    duration_ms: { type: Number },
    genre: [String]
});

var spotTracks = model('spotTracks', spotTracksSchema);

const spotPlaylist = new Schema({
    user_id: { type: String },
    type: { type: String },
    date: { type: Date },
    tracks: [ spotTracksSchema ],
    processed: { type: Boolean, default: false }
});

module.exports = model('Spot_Playlists', spotPlaylist);
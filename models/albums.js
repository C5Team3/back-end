const { Schema, model } = require('mongoose');

const albumsSchema = new Schema({
  spotifyId: { type: String, required: true, trim: true }, // id
  title: { type: String, required: [true, 'Album Title is required'], trim: true }, //name
  subtile: { type: String, required: false }, // label
  year: { type: String, required: false, trim: true }, // release_date
  about: { type: String, required: false }, // null
  cover_img: { type: String, required: [true, 'Cover Image is required'] }, // images[0]
  artist_Id:{type: Schema.Types.ObjectId, ref: 'Artists', require:false }, // Artist SpotifyId
}, {timestamps: true});

module.exports = model('Albums', albumsSchema);
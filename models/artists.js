const { Schema, model } = require('mongoose');

const artistSchema = new Schema({
  name: { type: String, required: [true, 'Artist Name is required'], trim: true },
  country: { type: String, uppercase: true, trim: true },
  about: { type: String, max: 500 },
  cover_img: { type: String },
  followers: { type: Number, min: 0, default: 0 },
  listenersCounter: { type: Number, min: 0, default: 0 },
  songs: { type: Number, min: 0, default: 0 },
  spotifyId:{ type: String, required:true, trim: true }
}, { timestamps: true });

module.exports = model('Artists', artistSchema);
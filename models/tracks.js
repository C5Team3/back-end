const { Schema, model } = require('mongoose');

const tracksSchema = new Schema({
  title: { type: String, required: [true, 'Track Title is required'], trim: true },
  duration_ms: { type: Number, min: 0, default: 0},
  likes: { type: Number, min: 0, default: 0},
  plays: { type: Number, min: 0, default: 0 },
  url: { type: String, require:true },
  spotifyId:{type: String, require:true},
  genres:{type: [], require:true},
  album_Id:{type: Schema.Types.ObjectId, ref: 'Albums', require:true },
  gender_Id:{type: Schema.Types.ObjectId, ref: 'Genders', require:false },
  artist_Id:{type: Schema.Types.ObjectId, ref: 'Artists', require:true },
}, {timestamps: true});

module.exports = model('Tracks', tracksSchema);
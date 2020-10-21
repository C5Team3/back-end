const { Schema, model } = require('mongoose');

const tracksSchema = new Schema({
  title: { type: String, required: [true, 'Track Title is required'], trim: true },
  duration: { type: String, required: true },
  favs: { type: Number, min: 0, default: 0},
  plays: { type: Number, min: 0, default: 0 },
  album_Id:{type: Schema.Types.ObjectId, ref: 'Albums', require:true },
  gender_Id:{type: Schema.Types.ObjectId, ref: 'Genders', require:true },
  artist_Id:{type: Schema.Types.ObjectId, ref: 'Artists', require:true },
}, {timestamps: true});

module.exports = model('Tracks', tracksSchema);
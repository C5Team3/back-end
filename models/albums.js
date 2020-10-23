const { Schema, model } = require('mongoose');

const albumsSchema = new Schema({
  title: { type: String, required: [true, 'Album Title is required'], trim: true },
  subtile: { type: String, required: false },
  year: { type: Number, required: true, trim: true },
  about: { type: String, required: false },
  cover_img: { type: String, required: [true, 'Cover Image is required'] },
  artist_Id:{type: Schema.Types.ObjectId, ref: 'Artists', require:true },
}, {timestamps: true});

module.exports = model('Albums', albumsSchema);
const { Schema, model, models } = require('mongoose');

const genderSchema = new Schema({
    genderName: { type: String, required: [true, 'Gender Name is required'] },
    about: { type: String, max: 500 },
    coverImgPath: { type: String }
}, { timestamps: true });

module.exports = model('Gender', genderSchema);
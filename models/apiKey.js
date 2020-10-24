const { Schema, model } = require('mongoose');

const apiKeySchema = new Schema({
  token: { type: String, required: [true, 'Api Key Token is required'], trim: true },
  scopes: {type: [], required: [true, 'Api Key Scopes are required'], trim: true },
  type: { type: String, required:false},
}, {timestamps: true});

module.exports = model('ApiKey', apiKeySchema);
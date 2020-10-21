const { Schema, model, models } = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new Schema({
  name: { type: String, required: [true, 'User name is required'], trim: true },
  lastname: { type: String, required: [true, 'User Lastname is required'], trim: true },
  country: { type: String, uppercase: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, trim: true },
  isAdmin: { type: Boolean },
  apiKeyToken: { type: String },
  isActive: { type: Boolean },
  avatarPath: { type: String },
}, {timestamps: true});

// Method to hash password
usersSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

usersSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

module.exports = model('Users', usersSchema);
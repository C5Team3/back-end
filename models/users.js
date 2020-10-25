const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new Schema({
  name: { type: String, required: [true, 'User name is required'], trim: true },
  lastname: { type: String, required: [true, 'User Lastname is required'], trim: true },
  country: { type: String, uppercase: true, trim: true },
  age:{type: Number, min: 0, default: 0},
  gender:{type: String, required: true, lowercase: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true},
  isAdmin: { type: Boolean, default:false },
  isActive: { type: Boolean, default:false },
  avatarPath: { type: String },
}, {timestamps: true});

// Method to hash password
usersSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});
// Remove Password Before Send
usersSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

module.exports = model('Users', usersSchema);
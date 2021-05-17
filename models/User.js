const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  rooms: { type: Array, default: [] }
});

module.exports = model('User', UserSchema);
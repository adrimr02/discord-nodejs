const { Schema, model } = require('mongoose');

const MessageSchema = new Schema({
  text: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  roomId: { type: String, required: true },
  postedAt: { type: Date, default: Date.now() }
});

module.exports = model('Message', MessageSchema);
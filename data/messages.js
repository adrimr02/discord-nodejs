const moment = require('moment');
const Message = require('../models/Message');

function formatMessage(username, text) {
  return {
    authorName: username,
    text,
    postedAt: moment().format('hh:mm a')
  }
}

function saveMessage(message, userId, username, roomId) {
  const newMessage = new Message({
    text: message,
    authorId: userId,
    authorName: username,
    roomId: roomId
  });
  
  newMessage.save()
    .catch(err => console.log(err));
}

function loadMessages(roomId) {
  return new Promise(function(resolve, reject){
    Message.find({ roomId: roomId })
      .then(messages => {
        resolve(messages.slice(messages.length - 50 >= 0 ? messages.length - 50 : 0, messages.length));
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  formatMessage,
  saveMessage,
  loadMessages
};
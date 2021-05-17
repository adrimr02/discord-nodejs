const { v4: uuidV4 } = require('uuid');
const moment = require('moment');

const users = []

// [
//   {
//     userName: String,
//     sessionId: String,
//     email: String,
//     password: String,
//     joined: Date
//   }
// ]

//Join user to chat
function addUser(id, dbUser, room) {
  const user = {sessionId: id, dbId: dbUser.id, username: dbUser.name, email: dbUser.email , room};

  users.push(user);
  
  return user;
}

function getCurrentUser(id) {
  return users.find(user => user.sessionId === id);
}

function deleteUser(id) {
  const index = users.findIndex(user => user.sessionId === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  addUser,
  getCurrentUser,
  deleteUser,
  getRoomUsers
}
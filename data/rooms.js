const { v4: uuidV4 } = require('uuid');
const moment = require('moment');

const rooms = [];

function createRoom(roomName, creatorName) {
  const newRoom = {
    id: uuidV4(),
    roomName,
    adminUserName: creatorName,
    allowedUserNames: [],
    messages: [],
    createdAt: moment().format('ddd D/MM/YY')
  }

  rooms.push(newRoom);
  addRoomUser(newRoom.id, creatorName);

  return newRoom.id;
}

function deleteRoom(roomId) {
  const index = rooms.findIndex(room => room.id === roomId);

  if (index !== -1) {
    rooms.splice(index, 1);
  }
}

function addRoomToUser(roomId, userName) {
  const roomIndex = rooms.findIndex(room => room.id === roomId);
  if (roomIndex !== -1) {
    rooms[roomIndex].allowedUsersId.push(userName);
  }
}

function deleteRoomFromUser(roomId, userId) {
  const roomIndex = rooms.findIndex(room => room.id === roomId);
  if (roomIndex !== -1) {
    const index = rooms[roomIndex].allowedUsersId.findIndex(user => user === userId);
    if (index !== -1) {
      rooms[roomIndex].allowedUsersId.splice(index, 1);
    }
  }
}

function getRoom(roomId) {
  return rooms.find(room => room.id === roomId);
}

module.exports = {
  createRoom,
  deleteRoom,
  getRoom,
  addRoomToUser,
  deleteRoomFromUser
}
const { formatMessage, saveMessage, loadMessages } = require('../data/messages');
const {addUser, getCurrentUser, deleteUser, getRoomUsers} = require('../data/users');

function connectSocket(io, socket) {
  socket.on('join-chatroom', ({ room }) => {
    const user = addUser(socket.id, socket.request.user, room);
    socket.join(user.room);

    loadMessages(user.room)
      .then(messages => {
        socket.emit('previous-data', { messages, user });
        //Broadcast when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage('Servidor', `${user.username} se ha unido al chat!`));
        
        //Send users and room info
        io.to(user.room).emit('room-info', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      })
      .catch(err => console.error(err));

    //Detects message from user
    socket.on('chatMessage', text => {
      const user = getCurrentUser(socket.id);
      const message = formatMessage(user.username, text);
      io.to(user.room).emit('message', message);
      saveMessage(message.text, user.dbId, user.username, user.room);
    });

    //Detects when user disconnects
    socket.on('disconnect', () => {
      const user = deleteUser(socket.id);
      if (user) {
        io.to(user.room).emit('message', formatMessage('Server', `${user.username} ha abandonado el chat`));

        //Send users and room info
        io.to(user.room).emit('room-info', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });
}

module.exports = {connectSocket};
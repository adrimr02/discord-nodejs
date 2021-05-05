const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const {addUser, getCurrentUser, deleteUser, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//sets server port
app.set('port', process.env.PORT || 3000)

io.on('connection', socket => {

  socket.on('join-chatroom', ({username, room}) => {
    const user = addUser(socket.id, username, room);

    socket.join(user.room);

    //Detects when new user joins
    socket.emit('message', formatMessage('Server', 'Welcome to Thiscordia!'));
  
    //Broadcast when user connects
    socket.broadcast.to(user.room).emit('message', formatMessage('Server', `${user.username} has joined the chat!`));
    
    //Send users and room info
    io.to(user.room).emit('room-info', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });


  //Detects message from user
  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, message));
  });

   //Detects when user disconnects
   socket.on('disconnect', () => {
    const user = deleteUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage('Server', `${user.username} has left the chat`));

      //Send users and room info
      io.to(user.room).emit('room-info', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

//sets static folder
app.use(express.static(path.join(__dirname, 'public')))

//starts server listening
server.listen(app.get('port'), () => console.log(`Server running on port ${app.get('port')}`));

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from url
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

socket.emit('join-chatroom', {username, room});

//Receives a message from server
socket.on('message', message => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Receives room info
socket.on('room-info', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Registers the message and deletes the form
  const text = e.target.elements.msg.value;
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

  //Sends the message to the server
  socket.emit('chatMessage', text);
})

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>
  `;

  chatMessages.appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Add user list to DOM
function outputUsers(users) {
  console.log(users);
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  })
}

//Promp the user before leaving the chat room
document.getElementById('leave-btn').addEventListener('click', e => {
  e.preventDefault();
  const leaveRoom = confirm('¿Estas seguro de que quieres salir?');
  if (leaveRoom) {
    window.location = '../index.html';
  }
});
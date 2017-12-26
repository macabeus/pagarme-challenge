const io = require('socket.io')();

const roomManager = require('../Services/RoomsManager');


function notifyNewListOfUsersInRoom(roomName) {
  io.sockets.in(roomName).emit(
    'room users', roomManager.rooms[roomName].users
  );
}

function notifyJoinInRoom(socket, isNewRoom, room) {
  socket.emit('join in room', {
    isNewRoom: isNewRoom,
    roomText: room.text,
    secondsRemaining: room.secondsRemaining()
  });
}

io.on('connection', (socket) => {
  socket.emit('connected');

  socket.on('join room', (roomName, userName) => {
    socket.join(roomName);


    const roomExists = roomManager.checkIfRoomExists(roomName);
    if (roomExists === false) {
      roomManager
        .createNewRoom(roomName);
    }

    roomManager
      .rooms[roomName]
      .joinUser(userName);

    notifyJoinInRoom(socket, !roomExists, roomManager.rooms[roomName]);
    notifyNewListOfUsersInRoom(roomName);

    socket.on('update kpm in last minute', (newValue) => {
      roomManager
        .rooms[roomName]
        .users[userName]
        .updateKeystrokesInLastMinute(newValue);
    })


    socket.on('update kpm maximum', (newScore) => {
      roomManager
        .rooms[roomName]
        .users[userName]
        .updateKpmMaximum(newScore);

      notifyNewListOfUsersInRoom(roomName);
    })


    socket.on('disconnect', () => {
      roomManager
        .rooms[roomName]
        .removeUser(userName);

      notifyNewListOfUsersInRoom(roomName);
    });
  });
});

module.exports = io;
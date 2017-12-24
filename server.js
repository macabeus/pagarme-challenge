'use strict';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/foo', (req, res) => {
  res.send('"foo"')
});

//

class User {
  constructor() {
    this.keystrokesInLastMinute = 0;
    this.kpmMaximum = 0;
  }

  updateKeystrokesInLastMinute(newValue) {
    this.keystrokesInLastMinute = newValue;
  }

  updateKpmMaximum(newScore) {
    if (this.kpmMaximum < newScore) {
      this.kpmMaximum = newScore;
    }
  }
}

class RoomsManager {
  constructor() {
    this.rooms = {}
  }

  createRoomOrJoinIn(roomName, userName) {
    if (this.rooms[roomName] === undefined) {
      this.rooms[roomName] = new Room();
    }

    this.rooms[roomName].joinUser(userName);
  }
}

class Room {
  constructor() {
    this.users = {}
  }

  joinUser(userName) {
    this.users[userName] = new User();
  }

  removeUser(userName) {
    delete this.users[userName];
  }
}

let roomManager = new RoomsManager();

//

function notifyNewListOfUsersInRoom(roomName) {
  io.sockets.in(roomName).emit(
    'room users', roomManager.rooms[roomName].users
  );
}

io.on('connection', (socket) => {
  socket.emit('connected');

  socket.on('join room', (roomName, userName) => {
    socket.join(roomName);


    roomManager
      .createRoomOrJoinIn(roomName, userName);
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

//

server.listen(3001);

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
}

class Room {
  constructor() {
    this.rooms = {}
  }

  createRoomOrJoinIn(roomName, userName) {
    if (this.rooms[roomName] === undefined) {
      this.rooms[roomName] = {};
    }

    this.rooms[roomName][userName] = new User();
  }

  removeUserFromRoom(roomName, userName) {
    delete this.rooms[roomName][userName];
  }

  updateKeystrokesInLastMinute(roomName, userName, newValue) {
    const userTarget = this.rooms[roomName][userName];
    userTarget.keystrokesInLastMinute = newValue;
  }

  updateKpmMaximum(roomName, userName, newScore) {
    const userTarget = this.rooms[roomName][userName];

    if (userTarget.kpmMaximum < newScore) {
      userTarget.kpmMaximum = newScore;
    }
  }

  notifyListOfUsersInRoom(roomName) {
    io.sockets.in(roomName).emit(
      'room users', this.rooms[roomName]
    );
  }
}

let room = new Room();

io.on('connection', (socket) => {
  socket.emit('connected');

  socket.on('join room', (roomName, userName) => {
    socket.join(roomName);


    room.createRoomOrJoinIn(roomName, userName);
    room.notifyListOfUsersInRoom(roomName);


    socket.on('update kpm in last minute', (newValue) => {
      room.updateKeystrokesInLastMinute(roomName, userName, newValue);
    })


    socket.on('update kpm maximum', (newScore) => {
      room.updateKpmMaximum(roomName, userName, newScore);
      room.notifyListOfUsersInRoom(roomName);
    })


    socket.on('disconnect', () => {
      room.removeUserFromRoom(roomName, userName);
      room.notifyListOfUsersInRoom(roomName);
    });
  });
});

//

server.listen(3001);

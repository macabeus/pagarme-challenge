'use strict';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/foo', (req, res) => {
  res.send('"foo"')
});

//

class Room {
  constructor() {
    this.rooms = {}
  }

  createRoomOrJoinIn(roomName, userName) {
    if (this.rooms[roomName] === undefined) {
      this.rooms[roomName] = [];
    }

    this.rooms[roomName].push(userName);
  }

  removeUserFromRoom(roomName, userName) {
    const index = this.rooms[roomName].indexOf(userName);
    this.rooms[roomName].splice(index, 1);
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

    socket.on('disconnect', () => {
      room.removeUserFromRoom(roomName, userName);
      room.notifyListOfUsersInRoom(roomName);
    });
  });
});

//

server.listen(3001);

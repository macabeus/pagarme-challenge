'use strict';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const moment = require('moment');
const gameTextGenerator = require('./GameTextGenerator');

app.get('/room/:roomname/status', (req, res) => {
  const roomTarget = roomManager.rooms[req.params.roomname];

  if (roomTarget === undefined) {
    res.send("This room didn't exist!");
    return
  }

  res.send({
    active_users: roomTarget.activeUsersCount(),
    keystrokes: roomTarget.keystrokesTotalInLastMinute(),
    active_since: roomTarget.activeSince(),
    counter: 0, // todo: needs create a system to start a game
    below_mean: roomTarget.belowMean(),
    ranking: roomTarget.ranking(),
    last_minute_lead: roomTarget.lastMinuteLead()
  })
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

  checkIfRoomExists(roomName) {
    return this.rooms[roomName] !== undefined
  }

  createNewRoom(roomName) {
    this.rooms[roomName] = new Room();
  }
}

class Room {
  constructor() {
    this.users = {};
    this.momentCreated = moment();
    this.momentFinish = this.momentCreated.add(5, 'minutes');
    this.text = gameTextGenerator.getRandomTextFromJson();
  }

  joinUser(userName) {
    this.users[userName] = new User();
  }

  removeUser(userName) {
    delete this.users[userName];
  }

  activeUsersCount() {
    return Object.entries(this.users).length;
  }

  keystrokesTotalInLastMinute() {
    return Object
      .values(this.users)
      .reduce((acc, user) => acc + user.keystrokesInLastMinute, 0);
  }

  activeSince() {
    return moment().diff(this.momentCreated, 'seconds')
  }

  /**
   * The total number of users who have score bellow of average score
   * (obtained by the arithmetic mean of kpm maximum at room)
   * @return {number}
   */
  belowMean() {
    const kpmMaximumTotal = Object
      .values(this.users)
      .reduce((acc, user) => acc + user.kpmMaximum, 0);

    const kpmMaximumAverage = kpmMaximumTotal /  this.activeUsersCount();

    const scoresBellowOfMean = Object
      .values(this.users)
      .filter(user => user.kpmMaximum < kpmMaximumAverage)

    return scoresBellowOfMean.length
  }

  /**
   * Return the list of users and the score of each one, sorted in ascending order
   * @return [Object] - List with object in format ["name of user", number of kpm maximum]
   */
  ranking() {
    return Object
      .entries(this.users)
      .map(user => [user[0], user[1].kpmMaximum])
      .sort((userA, userB) => userA[1] < userB[1])
  }

  /**
   * Return the name of user who have major keystrokes on last minute
   * @return {string|null}
   */
  lastMinuteLead() {
    return Object
      .entries(this.users)
      .reduce((lead, currently) => {
        if (lead.keystrokesInLastMinute < currently[1].keystrokesInLastMinute) {
          return {userName: currently[0], keystrokesInLastMinute: currently[1].keystrokesInLastMinute}
        } else {
          return lead
        }
      }, {userName: null, keystrokesInLastMinute: 0})
      .userName
  }
}

let roomManager = new RoomsManager();

//

function notifyNewListOfUsersInRoom(roomName) {
  io.sockets.in(roomName).emit(
    'room users', roomManager.rooms[roomName].users
  );
}

function notifyJoinInRoom(socket, isNewRoom, room) {
  socket.emit('join in room', {
    isNewRoom: isNewRoom,
    roomText: room.text,
    momentFinish: room.momentFinish
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

//

server.listen(3001);

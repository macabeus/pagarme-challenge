const Room = require('../Models/Room');


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

let roomManager = new RoomsManager();

module.exports = roomManager;
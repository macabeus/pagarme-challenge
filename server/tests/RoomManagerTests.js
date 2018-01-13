const chai = require('chai');
const expect = chai.expect;

const roomManager = require('../Services/RoomsManager');


describe('RoomManager', () => {
  const roomName = 'room-test';

  describe('When no room has yet been created', () => {
    it('Should with no room', () => {
      expect(Object.keys(roomManager.rooms).length).to.equal(0)
    });

    it('Should room has not exists yet' , () => {
      expect(roomManager.checkIfRoomExists(roomName)).to.equal(false)
    });
  });

  describe('When one room is created', () => {
    before(() => {
      roomManager
        .createNewRoom(roomName);
    });

    it('Should has one room', () => {
      expect(Object.keys(roomManager.rooms).length).to.equal(1)
    });

    it('Should room now exists' , () => {
      expect(roomManager.checkIfRoomExists(roomName)).to.equal(true)
    });
  });
});
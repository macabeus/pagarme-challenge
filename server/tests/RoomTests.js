const chai = require('chai');
const expect = chai.expect;

const roomManager = require('../Services/RoomsManager');


describe('Room', () => {
  const roomName = 'room-test';

  describe('When no room has yet been created', () => {
    it('Should rooms length needs be equal to 0', () => {
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

    it('Should rooms length needs be equal to 1', () => {
      expect(Object.keys(roomManager.rooms).length).to.equal(1)
    });

    it('Should room now exists' , () => {
      expect(roomManager.checkIfRoomExists(roomName)).to.equal(true)
    });

    it('Should have nobody in room', () => {
      const room = roomManager.rooms[roomName];

      expect(room.activeUsersCount()).to.equal(0)
    });

    it('Add 3 users to room', () => {
      const room = roomManager.rooms[roomName];

      room.joinUser('foo');
      room.joinUser('bar');
      room.joinUser('baz');

      expect(room.activeUsersCount()).to.equal(3)
    });

    it('One of users left', () => {
      const room = roomManager.rooms[roomName];

      room.setUserAsOffline('foo');

      expect(room.activeUsersCount()).to.equal(2)
    });

    it('Should return the total of keystrokes in last minute', () => {
      const room = roomManager.rooms[roomName];

      room.users['foo'].keystrokesInLastMinute = 1;
      room.users['bar'].keystrokesInLastMinute = 3;
      room.users['baz'].keystrokesInLastMinute = 6;

      expect(room.keystrokesTotalInLastMinute()).to.equal(10)
    });

    it('Should return the below mean', () => {
      const room = roomManager.rooms[roomName];

      room.users['foo'].kpmMaximum = 1;
      room.users['bar'].kpmMaximum = 3;
      room.users['baz'].kpmMaximum = 6;

      expect(room.belowMean()).to.equal(2)
    });

    it('Should return the ranking', () => {
      const room = roomManager.rooms[roomName];

      expect(room.ranking()).to.deep.equal([['baz', 6], ['bar', 3], ['foo', 1]])
    });

    it('Should return the last minute lead', () => {
      const room = roomManager.rooms[roomName];

      expect(room.lastMinuteLead()).to.equal('baz')
    });
  });
});
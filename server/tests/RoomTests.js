const chai = require('chai');
const expect = chai.expect;

const Room = require('../Models/Room');
const room = new Room();


describe('Room', () => {
  describe('When the room is empty', () => {
    it('Should has nobody in room', () => {
      expect(room.activeUsersCount()).to.equal(0)
    });

    it('Should return the total of keystrokes in last minute', () => {
      expect(room.keystrokesTotalInLastMinute()).to.equal(0)
    });

    it('Should return the below mean', () => {
      expect(room.belowMean()).to.equal(0)
    });

    it('Should return the ranking', () => {
      expect(room.ranking()).to.deep.equal([])
    });

    it('Should return the last minute lead', () => {
      expect(room.lastMinuteLead()).to.equal(null)
    });
  });

  describe('When the room has users', () => {
    before(() => {
      room.joinUser('foo');
      room.joinUser('bar');
      room.joinUser('baz');

      room.users['foo'].keystrokesInLastMinute = 1;
      room.users['bar'].keystrokesInLastMinute = 3;
      room.users['baz'].keystrokesInLastMinute = 6;

      room.users['foo'].kpmMaximum = 1;
      room.users['bar'].kpmMaximum = 3;
      room.users['baz'].kpmMaximum = 6;
    });

    it('Should return the active users count', () => {
      expect(room.activeUsersCount()).to.equal(3)
    });

    it('Should update the active users count value when a user lefts', () => {
      room.setUserAsOffline('foo');

      expect(room.activeUsersCount()).to.equal(2)
    });

    it('Should return the total of keystrokes in last minute', () => {
      expect(room.keystrokesTotalInLastMinute()).to.equal(10)
    });

    it('Should return the below mean', () => {
      expect(room.belowMean()).to.equal(2)
    });

    it('Should return the ranking', () => {
      expect(room.ranking()).to.deep.equal([['baz', 6], ['bar', 3], ['foo', 1]])
    });

    it('Should return the last minute lead', () => {
      expect(room.lastMinuteLead()).to.equal('baz')
    });
  });
});
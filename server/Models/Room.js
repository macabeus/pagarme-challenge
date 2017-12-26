const moment = require('moment');

const User = require('./User');
const gameTextGenerator = require('../Utils/gameTextGenerator');


class Room {
  constructor() {
    this.users = {};
    this.momentCreated = moment();
    this.momentFinish = moment().add(5, 'minutes');
    this.text = gameTextGenerator.getRandomTextFromJson();
  }

  joinUser(userName) {
    this.users[userName] = new User();
  }

  setUserAsOffline(userName) {
    this.users[userName].online = false;
  }

  activeUsersCount() {
    return Object
      .entries(this.users)
      .filter(user => user[1].online)
      .length
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

  secondsRemaining() {
    const secondsRemaining = this.momentFinish.diff(moment(), 'seconds');

    if (secondsRemaining > 0) {
      return secondsRemaining
    } else {
      return 0
    }
  }
}

module.exports = Room;
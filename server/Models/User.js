'use strict';


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

module.exports = User;
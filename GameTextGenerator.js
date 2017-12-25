const gameTexts = require('./gameTexts.json');

function getRandomTextFromJson() {
  return gameTexts[Math.floor(Math.random() * gameTexts.length)];
}

module.exports = {
  getRandomTextFromJson: getRandomTextFromJson
}
const express = require('express');
const router = express.Router();

const roomManager = require('../Services/RoomsManager');

router.get('/room/:roomname/status', (req, res) => {
  const roomTarget = roomManager.rooms[req.params.roomname];

  if (roomTarget === undefined) {
    res.send("This room didn't exist!");
    return
  }

  res.send({
    active_users: roomTarget.activeUsersCount(),
    keystrokes: roomTarget.keystrokesTotalInLastMinute(),
    active_since: roomTarget.activeSince(),
    counter: roomTarget.secondsRemaining(),
    below_mean: roomTarget.belowMean(),
    ranking: roomTarget.ranking(),
    last_minute_lead: roomTarget.lastMinuteLead()
  })
});

module.exports = router;

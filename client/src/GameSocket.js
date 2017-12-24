import io from 'socket.io-client';

class GameSocket {
  constructor(roomName, userName) {
    this.socket = io('http://localhost:3001');

    this.socket.on('connected', () => {
      console.log('socket connected');
      this.socket.emit('join room', roomName, userName)
    });

    this.socket.on('room users', (users) => {
      if (this.hookUpdateMembersList !== undefined) {
        this.hookUpdateMembersList(users)
      }
    });
  }

  updateKeystrokesInLastMinute(newValue) {
    this.socket.emit('update kpm in last minute', newValue);
  }

  updateKpmMaximum(newScore) {
    this.socket.emit('update kpm maximum', newScore);
  }
}

export default GameSocket;

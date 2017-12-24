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

  updateKpm(newScore) {
    this.socket.emit('update kpm', newScore);
  }
}

export default GameSocket;

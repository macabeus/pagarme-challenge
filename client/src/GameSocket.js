import io from 'socket.io-client';
import moment from 'moment';

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

    this.socket.on('join in room', (data) => {
      if (this.hookJoinInRoom !== undefined) {
        const isNewRoom = data.isNewRoom;
        const roomText = data.roomText;
        const momentFinish = moment(data.momentFinish);

        this.hookJoinInRoom(isNewRoom, roomText, momentFinish)
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

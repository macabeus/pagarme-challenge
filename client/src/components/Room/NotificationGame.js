import React, { Component } from 'react';

import {NotificationContainer, NotificationManager} from 'react-notifications';

class NotificationGame extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fetchedUserList: false
    }
  }

  static notificationJoinInRoom(isNewRoom) {
    if (isNewRoom) {
      NotificationManager.info('You created a new room!');
    } else {
      NotificationManager.info('You joined in a room!');
    }
  }

  notificationUpdatedUserList(oldUserList, newUserList) {
    if (this.state.fetchedUserList === true) {
      const newUsers = Object.keys(newUserList)
        .filter(userName => oldUserList[userName] === undefined);
      const usersLeft = Object.keys(oldUserList)
        .filter(userName => newUserList[userName] === undefined);

      newUsers.forEach(user => NotificationManager.info(`${user} joined in the room`));
      usersLeft.forEach(user => NotificationManager.info(`${user} left the room`));

    } else {

      this.setState({
        fetchedUserList: true
      })
    }
  }

  render() {
    return (
      <NotificationContainer/>
    )
  }
}

export default NotificationGame;
import React, { Component } from 'react';

import { Label } from 'react-bootstrap';

class Members extends Component {
  constructor(props) {
    super(props);

    this.username = props.username;
    this.socket = props.socket;
    this.socket.hookUpdateMembersList = this.updateMembersList.bind(this);

    this.state = {
      users: []
    }
  }

  componentWillUnmount() {
    this.socket.hookUpdateMembersList = undefined;
  }

  updateMembersList(users) {
    const newUserList = users;
    const oldUserList = this.state.users;
    this.props.onUpdateMemberList(oldUserList, newUserList);

    this.setState({
      users: users
    });
  }

  renderLabelYou(username) {
    if (username === this.username) {
      return <Label bsStyle="primary">You</Label>
    }
  }

  static renderLabelOffline(online) {
    if (online === false) {
      return <Label bsStyle="default">Offline</Label>
    }
  }

  render() {
    const users = Object
      .entries(this.state.users)
      .map(user => {
        return { name: user[0], online: user[1].online, score: user[1].kpmMaximum }
      })
      .sort((userA, userB) => {
        return userA.score < userB.score
      })

    return (
      <ul>
        {
          users.map((user) => {
            return <li key={user.name}>
              {user.name} ({user.score}) {this.renderLabelYou(user.name)} {Members.renderLabelOffline(user.online)}
            </li>
          })
        }
      </ul>
    )
  }
}

export default Members;
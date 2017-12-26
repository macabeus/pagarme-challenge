import React, { Component } from 'react';

class Members extends Component {
  constructor(props) {
    super(props);

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

  render() {
    const users = Object
      .entries(this.state.users)
      .map(user => {
        return { name: user[0], score: user[1].kpmMaximum.toFixed(2) }
      })
      .sort((userA, userB) => {
        return userA.score < userB.score
      })

    return (
      <ul>
        {
          users.map((user) => {
            return <li key={user.name}>{user.name} ({user.score})</li>
          })
        }
      </ul>
    )
  }
}

export default Members;
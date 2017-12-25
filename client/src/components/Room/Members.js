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
    this.setState({
      users: users
    });
  }

  render() {
    const users = Object.entries(this.state.users);
    const usersAndScore = users.map(k => `${k[0]} (${k[1].kpmMaximum.toFixed(2)})`);

    return (
      <ul>{usersAndScore.map((value) => <li key={value}>{value}</li>)}</ul>
    )
  }
}

export default Members;
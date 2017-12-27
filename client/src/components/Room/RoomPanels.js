import React, { Component } from 'react';

import GameSocket from '../../GameSocket';

import RoomText from './RoomText';
import Members from './Members';
import KeystrokesPerMinutes from './KeystrokesPerMinutes';
import NotificationGame from './NotificationGame';
import Countdown from './Countdown';
import TyperacerTextField from './TyperacerTextField';

import { Grid, Col, Panel } from 'react-bootstrap';


class RoomPanels extends Component {
  constructor(props) {
    super(props);

    const roomname = this.props.match.params.roomname;
    this.username = this.props.match.params.username;
    this.socket = new GameSocket(roomname, this.username);
    this.socket.hookJoinInRoom = this.handleJoinInRoom.bind(this);

    this.state = {
      running: false,
      text: '',
      secondsInitial: 0,
      keystrokeHistory: []
    }

    this.handleUpdatedUserList = this.handleUpdatedUserList.bind(this);
    this.handleOnTyperacerTextFieldChange = this.handleOnTyperacerTextFieldChange.bind(this);
    this.handleGameTimeout = this.handleGameTimeout.bind(this);
  }

  componentWillUnmount() {
    this.socket.socket.disconnect();
    this.socket.hookNewRoom = undefined;
  }

  handleJoinInRoom(isNewRoom, roomText, secondsRemaining) {
    NotificationGame.notificationJoinInRoom(isNewRoom);

    this.setState({
      running: true,
      text: roomText,
      secondsInitial: secondsRemaining
    })
  }

  handleUpdatedUserList(oldUsersList, newUsersList) {
    this.refs.notification.notificationUpdatedUserList(oldUsersList, newUsersList);
  }

  handleOnTyperacerTextFieldChange(keystrokeHistory) {
    this.setState({
      keystrokeHistory: keystrokeHistory
    })
  }

  handleGameTimeout() {
    NotificationGame.notificationTimeout();

    this.setState({
      running: false
    })
  }

  render() {
    return (
      <Grid fluid={true}>
        <Col xs={4}>
          <Panel header="Text to type">
            <RoomText
              text={this.state.text}
              keystrokeHistory={this.state.keystrokeHistory} />
          </Panel>
        </Col>

        <Col xs={4}>
          <Panel header="Your text">
            <TyperacerTextField
              text={this.state.text}
              enable={this.state.running}
              onChange={this.handleOnTyperacerTextFieldChange} />
          </Panel>
        </Col>

        <Col xs={4}>
          <Col xs={12}>
            <Panel header="Your score">
              <KeystrokesPerMinutes
                socket={this.socket}
                keystrokeHistory={this.state.keystrokeHistory} />
            </Panel>
          </Col>

          <Col xs={12}>
            <Panel header="Time">
              <Countdown
                secondsInitial={this.state.secondsInitial}
                active={this.state.running}
                onTimeout={this.handleGameTimeout} />
            </Panel>
          </Col>

          <Col xs={12}>
            <Panel header="Ranking">
              <Members
                socket={this.socket}
                username={this.username}
                onUpdateMemberList={this.handleUpdatedUserList} />
            </Panel>
          </Col>
        </Col>

        <NotificationGame ref='notification'/>
      </Grid>
    )
  }
}

export default RoomPanels;
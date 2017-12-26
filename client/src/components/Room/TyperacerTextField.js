import React, { Component } from 'react';
import moment from 'moment';
import GameSocket from '../../GameSocket';

import TyperacerText from './TyperacerText';
import Members from './Members';
import KeystrokesPerMinutes from './KeystrokesPerMinutes';
import NotificationGame from './NotificationGame';
import Countdown from './Countdown';

import { Grid, Col, Panel, FormControl } from 'react-bootstrap';

class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    const roomname = this.props.match.params.roomname;
    this.username = this.props.match.params.username;
    this.socket = new GameSocket(roomname, this.username);
    this.socket.hookJoinInRoom = this.handleJoinInRoom.bind(this);

    this.state = {
      text: '',
      textTypedHistory: [],
      lastWordIsIncorrect: false,
      secondsInitial: 0,
      timeout: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleUpdatedUserList = this.handleUpdatedUserList.bind(this);
    this.handleGameTimeout = this.handleGameTimeout.bind(this);
  }

  componentWillUnmount() {
    this.socket.socket.disconnect();
    this.socket.hookNewRoom = undefined;
  }

  handleJoinInRoom(isNewRoom, roomText, secondsRemaining) {
    NotificationGame.notificationJoinInRoom(isNewRoom);

    this.setState({
      text: roomText,
      secondsInitial: secondsRemaining
    })
  }

  handleUpdatedUserList(oldUsersList, newUsersList) {
    this.refs.notification.notificationUpdatedUserList(oldUsersList, newUsersList);
  }

  handleGameTimeout() {
    NotificationGame.notificationTimeout();

    this.setState({
      timeout: true
    })
  }

  handleChange(event) {
    const newValue = event.target.value;
    const textArray = this.state.text.split(' ');
    const textTypedHistory = this.state.textTypedHistory;

    const newValueWords = newValue
      .split(' ')
      .filter(word => word.length > 0);

    if (newValueWords.length > textTypedHistory.length) {
      // if a new word was is typed, then check if the new word is correct

      const newWord = newValueWords[newValueWords.length - 1];

      if (newWord === textArray[textTypedHistory.length]) {
        // the new word is correct

        const updatedTextTypedHistory = [...this.state.textTypedHistory, {word: newWord, moment: moment()}];

        this.setState({
          textTypedHistory: updatedTextTypedHistory,
          lastWordIsIncorrect: false
        });
      } else if (newValue[newValue.length - 1] === ' ') {
        // the new word is wrong

        this.setState({
          lastWordIsIncorrect: true
        });
      }
    }
  }

  render() {
    return (
      <Grid fluid={true}>
        <Col xs={4}>
          <Panel header="Text to type">
            <TyperacerText
              text={this.state.text}
              wordsTypedCount={this.state.textTypedHistory.length}
              lastWordIsIncorrect={this.state.lastWordIsIncorrect} />
          </Panel>
        </Col>

        <Col xs={4}>
          <Panel header="Your text">
            <FormControl componentClass="textarea" onChange={this.handleChange} disabled={this.state.timeout} />
          </Panel>
        </Col>

        <Col xs={4}>
          <Col xs={12}>
            <Panel header="Your score">
              <KeystrokesPerMinutes socket={this.socket} textTypedHistory={this.state.textTypedHistory} />
            </Panel>
          </Col>

          <Col xs={12}>
            <Panel header="Time">
              <Countdown secondsInitial={this.state.secondsInitial} onTimeout={this.handleGameTimeout} />
            </Panel>
          </Col>

          <Col xs={12}>
            <Panel header="Ranking">
              <Members socket={this.socket} username={this.username} onUpdateMemberList={this.handleUpdatedUserList} />
            </Panel>
          </Col>
        </Col>

        <NotificationGame ref='notification'/>
      </Grid>
    );
  }
}

export default TyperacerTextField;
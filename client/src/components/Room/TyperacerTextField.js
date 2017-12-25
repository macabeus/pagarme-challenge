import React, { Component } from 'react';
import moment from 'moment';
import MiniSignal from 'mini-signals';
import GameSocket from '../../GameSocket';

import TyperacerText from './TyperacerText';
import Members from './Members';
import KeystrokesPerMinutes from './KeystrokesPerMinutes';

import { Grid, Col, Panel, FormControl } from 'react-bootstrap';

import {NotificationContainer, NotificationManager} from 'react-notifications';

class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    this.kpmSignal = new MiniSignal();
    this.socket = new GameSocket(this.props.match.params.roomname, this.props.match.params.username);
    this.socket.hookJoinInRoom = this.joinInRoom.bind(this);

    this.state = {
      text: '',
      textTypedHistory: [],
      lastWordIsIncorrect: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUnmount() {
    this.socket.socket.disconnect();
    this.socket.hookNewRoom = undefined;
  }

  joinInRoom(isNewRoom, roomText) {
    if (isNewRoom) {
      NotificationManager.info('You created a new room!');
    } else {
      NotificationManager.info('You joined in a room!');
    }

    this.setState({
      text: roomText
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

        this.kpmSignal.dispatch(updatedTextTypedHistory);
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
            <FormControl componentClass="textarea" onChange={this.handleChange} />
          </Panel>
        </Col>

        <Col xs={4}>
            <Col xs={12}>
              <Panel header="Your score">
                <KeystrokesPerMinutes socket={this.socket} kpmSignal={this.kpmSignal} />
              </Panel>
            </Col>

            <Col xs={12}>
              <Panel header="Ranking">
                <Members socket={this.socket} />
              </Panel>
            </Col>
        </Col>

        <NotificationContainer/>
      </Grid>
    );
  }
}

export default TyperacerTextField;
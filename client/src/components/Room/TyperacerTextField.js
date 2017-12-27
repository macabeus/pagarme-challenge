import React, { Component } from 'react';
import moment from 'moment';

import { FormControl } from 'react-bootstrap';


class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    this.hookOnChange = props.onChange;

    this.state = {
      text: '',
      keystrokeHistory: [],
      enable: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.enable !== nextProps.enable) {
      this.setState({
        enable: nextProps.enable
      })
    }

    if (this.state.text !== nextProps.text) {
      this.setState({
        text: nextProps.text,
        keystrokeHistory: []
      })
    }

    if (this.state.keystrokeHistory.length !== nextState.keystrokeHistory.length) {
      this.hookOnChange(nextState.keystrokeHistory)
    }
  }

  handleChange(event) {
    const textChars = this.state.text.split('');
    const keystrokesHistory = this.state.keystrokeHistory;

    const userText = event.target.value;
    const userTextLength = userText.length - 1;
    const newCharacter = userText[userTextLength];

    if (keystrokesHistory.length === userText.length) {
      // The user already wrote all text
      return
    }
    
    const updatedKeystrokesHistory = keystrokesHistory.slice(0, userTextLength);
    updatedKeystrokesHistory[userTextLength] = {
      character: newCharacter,
      correct: textChars[userTextLength] === newCharacter,
      moment: moment()
    }

    this.setState({
      keystrokeHistory: updatedKeystrokesHistory
    });
  }

  render() {
    return (
      <FormControl componentClass="textarea" onChange={this.handleChange} disabled={!this.state.enable} />
    );
  }
}

export default TyperacerTextField;
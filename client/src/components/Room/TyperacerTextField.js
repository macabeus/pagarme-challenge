import React, { Component } from 'react';
import moment from 'moment';

import { FormControl } from 'react-bootstrap';


class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    this.hookOnChange = props.onChange;

    this.state = {
      text: '',
      textTypedHistory: [],
      lastWordIsIncorrect: false,
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
        textTypedHistory: [],
        lastWordIsIncorrect: false
      })
    }

    if (
      (this.state.textTypedHistory.length !== nextState.textTypedHistory.length) ||
      (this.state.lastWordIsIncorrect !== nextState.lastWordIsIncorrect)
    ) {

      this.hookOnChange(nextState.textTypedHistory, nextState.lastWordIsIncorrect)
    }
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
      <FormControl componentClass="textarea" onChange={this.handleChange} disabled={!this.state.enable} />
    );
  }
}

export default TyperacerTextField;
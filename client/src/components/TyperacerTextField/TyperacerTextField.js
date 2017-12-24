import React, { Component } from 'react';
import moment from 'moment';
import MiniSignal from 'mini-signals';
import GameSocket from '../../GameSocket';

function TyperacerText(props) {
  const textArray = props.textArray;

  // Get typed words
  const textTyped = textArray
    .slice(0, props.wordsTypedCount)
    .join(' ');

  // Get *not* typed words
  let wrongTypedWord;
  let textNotTyped;
  if (props.lastWordIsIncorrect === true) {
    wrongTypedWord = textArray[props.wordsTypedCount];

    textNotTyped = textArray
      .slice(props.wordsTypedCount + 1, textArray.length)
      .join(' ');
  } else {
    textNotTyped = textArray
      .slice(props.wordsTypedCount, textArray.length)
      .join(' ');
  }

  //
  return (
    <p>
      <strong>{textTyped}</strong> <span style={{color: 'red'}}>{wrongTypedWord}</span> {textNotTyped}
    </p>
  );
}

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
      <p><strong>Members in room: </strong> {usersAndScore.join(', ')}</p>
    )
  }
}

class KeystrokesPerMinutes extends Component {
  constructor(props) {
    super(props);

    this.kpmSignal = props.kpmSignal;
    this.socket = props.socket;

    this.state = {
      seconds: 0,
      textTypedHistory: [],
      textTypedCountByMinute: {}
    };

    this.updateTextTyped = this.updateTextTyped.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
    this.binding = this.kpmSignal.add(this.updateTextTyped);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.binding.detach();
  }

  updateTextTyped(textTypedHistory) {
    // Update the counter of how many words was typed in each minute
    const textTypedCountByMinute = this.state.textTypedCountByMinute;

    const currentMinute = Math.floor(this.state.seconds / 60);
    if (textTypedCountByMinute[currentMinute] === undefined) {
      textTypedCountByMinute[currentMinute] = 0;
    }

    textTypedCountByMinute[currentMinute] += 1;

    //
    this.setState({
      textTypedHistory: textTypedHistory,
      textTypedCountGroupedByMinute: textTypedCountByMinute
    });
  }

  tick() {
    this.setState({
      seconds: this.state.seconds + 1
    });

    this.socket.updateKeystrokesInLastMinute(this.keystrokesInLastMinute());
    this.socket.updateKpmMaximum(this.kpmMaximum());
  }

  keystrokesInLastMinute() {
    const textTypedHistory = this.state.textTypedHistory;

    const lastMinute = moment().subtract(1, 'minute');
    const textTypedHistoryFiltered = textTypedHistory
      .filter(t => lastMinute.isBefore(t.moment))
      .map(t => t.word);

    return textTypedHistoryFiltered.length;
  }

  kpmInLastMinute() {
    const textTypedPerMinute = this.keystrokesInLastMinute() / 60;

    return textTypedPerMinute;
  }

  kpmMaximum() {
    if (Object.keys(this.state.textTypedCountByMinute).length === 0) { return 0 }

    const textTypedCountByMinute = this.state.textTypedCountByMinute;

    const textTypedPerMinute = Object.values(textTypedCountByMinute)
      .map(keystrokesCount => keystrokesCount / 60)

    const maximumPerMinute = Math.max(...textTypedPerMinute);

    return maximumPerMinute;
  }

  render() {
    return (
      <p>
        <strong>{this.kpmInLastMinute().toFixed(2)}</strong> words per minute currently.
        Your the best value is <strong>{this.kpmMaximum().toFixed(2)}</strong> words per minute.
      </p>
    )
  }
}

class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    this.kpmSignal = new MiniSignal();
    this.socket = new GameSocket(this.props.match.params.roomname, this.props.match.params.username);

    const text = 'Hey, you need to type this very very long text! And now!';
    this.textArray = text.split(' ');

    this.state = {
      textTypedHistory: [],
      lastWordIsIncorrect: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUnmount() {
    this.socket.socket.disconnect();
  }

  handleChange(event) {
    const newValue = event.target.value;
    const textArray = this.textArray;
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
      <div className="App">
        <TyperacerText
          textArray={this.textArray}
          wordsTypedCount={this.state.textTypedHistory.length}
          lastWordIsIncorrect={this.state.lastWordIsIncorrect} />

        <textarea onChange={this.handleChange} />

        <KeystrokesPerMinutes socket={this.socket} kpmSignal={this.kpmSignal} />

        <Members socket={this.socket} />
      </div>
    );
  }
}

export default TyperacerTextField;
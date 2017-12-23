import React, { Component } from 'react';
import moment from 'moment';
import MiniSignal from 'mini-signals';

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

class KeystrokesPerMinutes extends Component {
  constructor(props) {
    super(props);

    this.kpmSignal = props.kpmSignal;

    this.state = {
      seconds: 0,
      textTypedHistory: []
    };

    this.updateTextTypedHistory = this.updateTextTypedHistory.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
    this.binding = this.kpmSignal.add(this.updateTextTypedHistory);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.binding.detach();
  }

  updateTextTypedHistory(textTypedHistory) {
    this.setState({
      textTypedHistory: textTypedHistory
    });
  }

  tick() {
    this.setState({
      seconds: this.state.seconds + 1
    });
  }

  render() {
    const textTypedHistory = this.state.textTypedHistory;

    const lastMinute = moment().subtract(1, 'minute');
    const textTypedHistoryFiltered = textTypedHistory
      .filter(t => lastMinute.isBefore(t.moment))
      .map(t => t.word);
    const textTypedPerMinute = textTypedHistoryFiltered.length / 60;

    return (
      <p>
        {textTypedPerMinute.toFixed(2)} words per minute
      </p>
    )
  }
}

class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    this.kpmSignal = new MiniSignal();

    const text = 'Hey, you need to type this very very long text! And now!';
    this.textArray = text.split(' ');

    this.state = {
      textTypedHistory: [],
      lastWordIsIncorrect: false
    }

    this.handleChange = this.handleChange.bind(this);
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

        <KeystrokesPerMinutes kpmSignal={this.kpmSignal} />
      </div>
    );
  }
}

export default TyperacerTextField;
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

  kpmLastMinute() {
    const textTypedHistory = this.state.textTypedHistory;

    const lastMinute = moment().subtract(1, 'minute');
    const textTypedHistoryFiltered = textTypedHistory
      .filter(t => lastMinute.isBefore(t.moment))
      .map(t => t.word);
    const textTypedPerMinute = textTypedHistoryFiltered.length / 60;

    return textTypedPerMinute;
  }

  kpmMaximum() {
    const textTypedHistory = this.state.textTypedHistory;
    if (textTypedHistory.length === 0) { return 0 }

    // Count how many words was type in each full minute intervals
    const secondInitial = textTypedHistory[0].moment.second();
    const secondFinal = moment().second();

    const intervals = Math.floor(
      (secondFinal - secondInitial) / 60
    );

    const intervalsScore = textTypedHistory.reduce((result, v) => {
      const interval = Math.floor((v.moment.second() - secondInitial) / 60);

      result[0][interval] += 1;

      return result
    }, [ Array.apply(null, {length: intervals + 1}).map(() => 0) ]);

    // Get the maximum words by minute, and divide by 60 seconds
    const maximumAbsolute = Math.max(...intervalsScore[0])
    const maximumPerMinute = maximumAbsolute / 60;

    //
    return maximumPerMinute
  }

  render() {
    return (
      <p>
        <strong>{this.kpmLastMinute().toFixed(2)}</strong> words per minute currently.
        Your the best value is <strong>{this.kpmMaximum().toFixed(2)}</strong> words per minute.
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
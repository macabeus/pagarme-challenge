import React, { Component } from 'react';

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

class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    const text = 'Hey, you need to type this!';
    this.textArray = text.split(' ');

    this.state = {
      textTypedHistory: [],
      lastWordIsIncorrect: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // check if a new word as typed - that is, a space was typed
    const newValue = event.target.value;
    if (newValue[newValue.length - 1] !== ' ') { return }

    //
    const textArray = this.textArray;
    const textTypedHistory = this.state.textTypedHistory;

    const newValueSplited = newValue
      .split(' ')
      .filter(word => word.length > 0);

    if (newValueSplited.length > textTypedHistory.length) {
      // if a new word was is typed, then check if the new word is correct

      const newWord = newValueSplited[newValueSplited.length - 1];

      if (newWord === textArray[textTypedHistory.length]) {
        // the new word is correct

        this.setState({
          textTypedHistory: [...this.state.textTypedHistory, newWord],
          lastWordIsIncorrect: false
        });
      } else {
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
      </div>
    );
  }
}

export default TyperacerTextField;
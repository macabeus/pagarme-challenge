import React, { Component } from 'react';

function TyperacerText(props) {
  const textArray = props.textArray;

  const textTyped = textArray
    .slice(0, props.wordsTypedCount)
    .join(' ');

  const textNotTyped = textArray
    .slice(props.wordsTypedCount, textArray.length)
    .join(' ');

  return (
    <p>
      <strong>{textTyped}</strong> {textNotTyped}
    </p>
  );
}

class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    const text = 'Hey, you need to type this!';

    this.state = {
      textArray: text.split(' '),
      textTypedHistory: []
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // check if a new word as typed
    const newValue = event.target.value;
    const textArray = this.state.textArray;
    const textTypedHistory = this.state.textTypedHistory;

    const newValueSplited = newValue
      .split(' ')
      .filter(word => word.length > 0);

    if (newValueSplited.length > textTypedHistory.length) {
      // if a new word was is typed, then check if the new word is correct

      const newWord = newValueSplited[newValueSplited.length - 1];

      if (newWord === textArray[textTypedHistory.length]) {
        this.setState({
          textTypedHistory: [...this.state.textTypedHistory, newWord]
        });
      }
    }
  }

  render() {
    return (
      <div className="App">
        <TyperacerText textArray={this.state.textArray} wordsTypedCount={this.state.textTypedHistory.length} />
        <textarea onChange={this.handleChange} />
      </div>
    );
  }
}

export default TyperacerTextField;
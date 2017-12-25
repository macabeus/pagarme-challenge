import React, { Component } from 'react';
import moment from 'moment';

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

export default KeystrokesPerMinutes;
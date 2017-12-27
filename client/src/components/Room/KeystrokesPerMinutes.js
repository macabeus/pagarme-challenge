import React, { Component } from 'react';
import moment from 'moment';

class KeystrokesPerMinutes extends Component {
  constructor(props) {
    super(props);

    this.socket = props.socket;

    this.state = {
      seconds: 0,
      keystrokeHistory: [],
      keystrokeCountByMinute: {}
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    // Update the counter of how many words was typed in each minute
    if (nextProps.keystrokeHistory.length === this.state.keystrokeHistory.length) { return }

    const keystrokeCountByMinute = this.state.keystrokeCountByMinute;

    const currentMinute = Math.floor(this.state.seconds / 60);
    if (keystrokeCountByMinute[currentMinute] === undefined) {
      keystrokeCountByMinute[currentMinute] = 0;
    }

    keystrokeCountByMinute[currentMinute] += 1;

    //
    this.setState({
      keystrokeHistory: nextProps.keystrokeHistory,
      keystrokeCountByMinute: keystrokeCountByMinute
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
    const keystrokeHistory = this.state.keystrokeHistory;

    const lastMinute = moment().subtract(1, 'minute');
    const keystrokeHistoryFiltered = keystrokeHistory
      .filter(t => lastMinute.isBefore(t.moment))
      .map(t => t.word);

    return keystrokeHistoryFiltered.length;
  }

  kpmInLastMinute() {
    const keystrokesPerMinute = this.keystrokesInLastMinute() / 60;

    return keystrokesPerMinute;
  }

  kpmMaximum() {
    if (Object.keys(this.state.keystrokeCountByMinute).length === 0) { return 0 }

    const keystrokeCountByMinute = this.state.keystrokeCountByMinute;

    const keystrokePerMinute = Object.values(keystrokeCountByMinute)
      .map(keystrokesCount => keystrokesCount / 60)

    const maximumPerMinute = Math.max(...keystrokePerMinute);

    return maximumPerMinute;
  }

  render() {
    return (
      <div>
        <p><strong>{this.kpmInLastMinute().toFixed(2)}</strong> characters per minute currently.</p>
        <p>Your best value is <strong>{this.kpmMaximum().toFixed(2)}</strong> words per minute.</p>
      </div>
    )
  }
}

export default KeystrokesPerMinutes;
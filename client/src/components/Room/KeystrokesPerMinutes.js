import React, { Component } from 'react';
import moment from 'moment';

class KeystrokesPerMinutes extends Component {
  constructor(props) {
    super(props);

    this.socket = props.socket;

    this.state = {
      seconds: 0,
      keystrokeHistory: [],
      keystrokeCountByMinute: []
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
    // Update the counter of how many words was typed in each minute, if a new correct char was type
    const nextHistoryFiltered = nextProps.keystrokeHistory.filter(history => history.correct);
    const currentHistoryFiltered = this.state.keystrokeHistory.filter(history => history.correct);
    if (nextHistoryFiltered.length === 0 || nextHistoryFiltered.length === currentHistoryFiltered.length) {
      // No new valid characters were entered
      return
    }

    // Count how many words was type in each full minute intervals
    const timeNow = moment();
    const firstMoment = nextHistoryFiltered[0].moment;
    const minutes = timeNow.diff(firstMoment, 'minutes');

    const keystrokeCountByMinute = nextHistoryFiltered.reduce((acc, v) => {
      const interval = v.moment.diff(firstMoment, 'minutes');

      acc[0][interval] += 1;

      return acc
    }, [ Array.apply(null, {length: minutes + 1}).map(() => 0) ])[0];

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
      .filter(history => history.correct && lastMinute.isBefore(history.moment))

    return keystrokeHistoryFiltered.length;
  }

  kpmMaximum() {
    if (Object.keys(this.state.keystrokeCountByMinute).length === 0) { return 0 }

    const keystrokeCountByMinute = this.state.keystrokeCountByMinute;
    const maximumPerMinute = Math.max(...keystrokeCountByMinute);

    return maximumPerMinute;
  }

  render() {
    return (
      <div>
        <p><strong>{this.keystrokesInLastMinute()}</strong> keystrokes per minute in the last 60 seconds.</p>
        <p>Your best value is <strong>{this.kpmMaximum()}</strong> keystrokes per minute.</p>

        <ul>
        {this.state.keystrokeCountByMinute.map((v, index) => {
          return <li key={index}><strong>Minute {index}:</strong> {v} keystrokes</li>
        })}
        </ul>
      </div>
    )
  }
}

export default KeystrokesPerMinutes;
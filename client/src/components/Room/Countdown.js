import React, { Component } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);

class Countdown extends Component {
  constructor(props) {
    super(props);

    this.hookOnTimeout = props.onTimeout;

    this.state = {
      secondsInitial: props.secondsInitial,
      seconds: props.secondsInitial
    }

    this.tick = this.tick.bind(this);
    this.startTimerIfNeed();
  }

  componentWillUpdate(nextProps) {
    if (this.state.secondsInitial === nextProps.secondsInitial) { return }

    if (nextProps.secondsInitial === undefined) {
      clearInterval(this.interval);
    } else {
      this.setState({
        secondsInitial: nextProps.secondsInitial,
        seconds: nextProps.secondsInitial
      });
    }
  }

  startTimerIfNeed() {
    if (this.interval === undefined) {
      this.interval = setInterval(this.tick, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    const seconds = this.state.seconds - 1;

    this.setState({
      seconds: seconds
    })

    if (this.state.seconds <= 0) {
      this.hookOnTimeout();
      clearInterval(this.interval);
    }
  }

  render() {
    const seconds = (this.state.seconds >= 0) ? this.state.seconds : 0;
    const secondsFormatted = moment.duration(seconds, 'seconds').format('mm:ss');

    return <p>{secondsFormatted}</p>
  }
}

export default Countdown;
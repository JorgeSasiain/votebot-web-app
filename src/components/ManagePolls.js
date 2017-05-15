import React, { Component } from 'react';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import { VIEWS, ONE_HOUR, ONE_MINUTE } from './constants';
import XMPP from '../xmpp';

class PollItem extends Component {

  constructor(props) {
    super(props);
    this.state = {minutesLeft: 0, untilExpireMinutesLeft: 0};
    this.poll = this.props.poll;
    this.timeLeft = 0;
    this.untilExpireTimeLeft = 0;
    this.timer = {};
    this.timerTick = this.timerTick.bind(this);
    this.stateTick = this.stateTick.bind(this);
    this.toDetails = this.toDetails.bind(this);
    this.terminate = this.terminate.bind(this);
    this.rerenderParent = this.rerenderParent.bind(this);
  }

  componentWillMount() {

    let curTime = new Date().getTime();
    let expireAt = new Date(this.poll.expireAt).getTime();
    let inactiveAt = this.poll.private ? expireAt - (24 * ONE_HOUR) : expireAt;

    if (expireAt - curTime > 0)
      this.untilExpireTimeLeft = expireAt - curTime;

    if (inactiveAt - curTime > 0)
      this.timeLeft = inactiveAt - curTime;

    this.stateTick();

  }

  componentDidMount() {
    var that = this;
    this.timer = setInterval(
      function () {
        that.timerTick();
        that.stateTick();
      },
      ONE_MINUTE
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timerTick() {

    if (this.timeLeft > ONE_MINUTE) {
      this.timeLeft -= ONE_MINUTE;
    } else {
      this.timeLeft = 0;
    }

    if (this.untilExpireTimeLeft > ONE_MINUTE) {
      this.untilExpireTimeLeft -= ONE_MINUTE;
    } else {
      this.untilExpireTimeLeft = 0;
    }

  }

  stateTick() {

    if (this.timeLeft > ONE_MINUTE) {
      this.setState({minutesLeft: this.timeLeft / ONE_MINUTE});
    } else {
      this.setState({minutesLeft: 0});
    }

    if (this.untilExpireTimeLeft > ONE_MINUTE) {
      this.setState({untilExpireMinutesLeft: this.untilExpireTimeLeft / ONE_MINUTE});
    } else {
      this.setState({untilExpireMinutesLeft: 0});
    }

  }

  toDetails(event) {
    event.preventDefault();
  }

  terminate(event) {
    event.preventDefault();
  }

  rerenderParent() {

  }

  render() {
    return (
      <div>
        <b>{this.poll.title}: </b>
        {this.state.minutesLeft > 0
          ? 'Quedan ' + (this.state.minutesLeft | 0) + ' minutos'
          : 'Finalizada se borrará en ' + (this.state.untilExpireMinutesLeft | 0) + ' minutos'
        }
        <button type="button" onClick={this.toDetails}>Ver detalles</button>
        <button type="button" onClick={this.terminate}>Finalizar</button>
      </div>
    );
  }
}

class ManagePolls extends Component {

  constructor(props) {
    super(props);
    this.state = {pollItems: []};
    this.responseJson = [];
    this.toMainMenu = this.toMainMenu.bind(this);
  }

  componentDidMount() {

    let getRequest = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    };

    fetch('/polls/'+XMPP.jid, getRequest).then(response => {

      if (response.status >= 400) return;
      return response.json();

    }).then(data => {

      this.responseJson = data;
      for (let poll of this.responseJson) {
        this.setState({
          pollItems: this.state.pollItems.concat([<PollItem poll={poll} />])
        });
      }
    });

  }

  toMainMenu(event) {
    event.preventDefault();
    this.props.setView(VIEWS.MAIN_MENU);
  }

  render() {
    return (
      <div className="Manage-polls">
        {this.state.pollItems}
        <button type="button" onClick={this.toMainMenu}>
          Volver al menú principal
        </button>
      </div>
    );
  }
}

export default ManagePolls;

import React, { Component } from 'react';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import { VIEWS, ONE_HOUR, ONE_MINUTE } from '../constants';
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
    this.rerenderParent = this.rerenderParent.bind(this);
    this.toDetails = this.toDetails.bind(this);
    this.terminate = this.terminate.bind(this);
    this.delete = this.delete.bind(this);
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

  rerenderParent() {
    this.props.c().rerender();
  }

  toDetails(event) {
    event.preventDefault();
    this.props.c().toDetails(this.poll._id);
  }

  terminate(event) {
    event.preventDefault();
    this.props.c().terminate(this.poll._id);
    this.rerenderParent();
  }

  delete(event) {
    event.preventDefault();
    this.props.c().delete(this.poll._id);
    this.rerenderParent();
  }

  render() {
    return (
      <div>
      {
        (this.poll.hasOwnProperty("title") && this.poll.private)

        ? /* Poll */
        <div>
          <b>{this.poll.title}: </b>
          {
            this.state.minutesLeft > 0
            ? 'Quedan ' + (this.state.minutesLeft | 0) + ' minutos'
            : 'Finalizada (se borrará en ' + (this.state.untilExpireMinutesLeft | 0) + ' minutos)'
          }
          <button type="button" onClick={this.toDetails}>Ver detalles</button>
          {
            this.state.minutesLeft > 0
            ? <button type="button" onClick={this.terminate}>Finalizar</button>
            : <button type="button" onClick={this.delete}>Eliminar</button>
          }
        </div>

        : /* Vote */
        <div>
          <b><i>{this.poll.questions[0].question}: </i></b>
          {
            this.state.minutesLeft > 0
            ? 'Quedan ' + (this.state.minutesLeft | 0) + ' minutos'
            : 'Finalizada (a punto de ser borrada)'
          }
          <button type="button" onClick={this.toDetails}>Ver detalles</button>
          {
            this.state.minutesLeft > 0 &&
              <button type="button" onClick={this.delete}>Finalizar y eliminar</button>
          }
        </div>

      }
      </div>
    );
  }
}

class PollDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.poll = this.props.poll;
    this.back = this.back.bind(this);
  }

  back(event) {
    event.preventDefault();
    this.props.returnToGeneralView();
  }

  render() {
    return (
      <div>
        <h2>{
          this.poll.hasOwnProperty("title") && this.poll.private
            && this.poll.title
        }</h2>
        {
          this.poll.questions.map(
            item => {
              let elements = [];
              for (let i = 0; i < item.choices.length; i ++) {
                elements.push(<li>{item.choices[i]}: {item.votes[i]} votos<br/></li>);
              }
              return <div><h3>{item.question}</h3><ul>{elements}</ul></div>
            }
          )
        }
        <button type="button" onClick={this.back}>Volver</button>
      </div>
    );
  }

}

class ManagePolls extends Component {

  constructor(props) {
    super(props);
    this.state = { inDetailsView: false, pollItems: [], selectedPoll: 0 };
    this.responseJson = [];
    this.reload = this.reload.bind(this);
    this.toMainMenu = this.toMainMenu.bind(this);
    this.returnToGeneralView = this.returnToGeneralView.bind(this);
    this.callbacks = this.callbacks.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  reload() {

    this.setState({pollItems: []});

    let getRequest = {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    };

    fetch('/polls', getRequest).then(response => {

      if (response.status >= 400) return;
      return response.json();

    }).then(data => {

      this.responseJson = data;
      for (let poll of this.responseJson) {
        this.setState({
          pollItems: this.state.pollItems.concat([
            <PollItem poll={poll} c={this.callbacks} />
          ])
        });
      }
    });

  }

  toMainMenu(event) {
    event.preventDefault();
    this.props.setView(VIEWS.MAIN_MENU);
  }

  returnToGeneralView() {
    this.setState({inDetailsView: false});
  }

  callbacks() {

    let that = this;

    return {

      rerender: function() {
        that.reload();
      },

      toDetails: function(_id) {
        that.setState(
          {selectedPoll: _id},
          that.setState({inDetailsView: true})
        );
      },

      terminate: function(_id) {
        let putRequest = {
          method: 'PUT',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            date: new Date().getTime() + 24 * ONE_HOUR
          })
        };
        fetch('/polls/' + _id, putRequest).then(response => {
          if (response.status >= 400) return;
        });
      },

      delete: function(_id) {
        let deleteRequest = {
          method: 'DELETE',
          credentials: 'same-origin'
        };
        fetch('/polls/' + _id, deleteRequest).then(response => {
          if (response.status >= 400) return;
        });
      }

    }

  }

  render() {
    return (
      <div className="Manage-polls">
        {
          this.state.inDetailsView
          ? <PollDetails
              poll={
                this.state.pollItems.find(
                  item => item.props.poll._id === this.state.selectedPoll
                ).props.poll
              }
              returnToGeneralView={this.returnToGeneralView}
            />
          : this.state.pollItems
        }
        <button type="button" onClick={this.toMainMenu}>
          Volver al menú principal
        </button>
      </div>
    );
  }
}

export default ManagePolls;

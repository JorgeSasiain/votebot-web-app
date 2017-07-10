import React, { Component } from 'react';
import { VIEWS } from '../constants';
import XMPP from '../xmpp';

class SubmitButton extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <input type="submit" value={this.props.value} />
      </form>
    );
  }
}

class MainMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.toNewVote = this.toNewVote.bind(this);
    this.toNewPoll = this.toNewPoll.bind(this);
    this.toManagePolls = this.toManagePolls.bind(this);
    this.logout = this.logout.bind(this);
  }

  toNewVote(event) {
    event.preventDefault();
    this.props.setView(VIEWS.NEW_VOTE);
  }

  toNewPoll(event) {
    event.preventDefault();
    this.props.setView(VIEWS.NEW_POLL);
  }

  toManagePolls(event) {
    event.preventDefault();
    this.props.setView(VIEWS.MANAGE_POLLS);
  }

  logout(event) {
    event.preventDefault();
    XMPP.disconnect("logout");
  }

  render() {
    return (
      <div className="Main-menu">
        <SubmitButton
          value="Crear nueva encuesta pública"
          onSubmit={this.toNewVote}
        />
        <SubmitButton
          value="Crear nueva encuesta privada"
          onSubmit={this.toNewPoll}
        />
        <SubmitButton
          value="Gestionar encuestas activas"
          onSubmit={this.toManagePolls}
        />
        <SubmitButton
          value="Salir"
          onSubmit={this.logout}
        />
      </div>
    );
  }
}

export default MainMenu;

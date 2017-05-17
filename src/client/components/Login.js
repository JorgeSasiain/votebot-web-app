import React, { Component } from 'react';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import { VIEWS } from '../constants';
import XMPP from '../xmpp';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {jidValue: '', passValue: '', show: false};
    this.handleJidChange = this.handleJidChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.showHide = this.showHide.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onConnected = this.onConnected.bind(this);
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  handleJidChange(event) {
    this.setState({jidValue: event.target.value});
  }

  handlePassChange(event) {
    this.setState({passValue: event.target.value});
  }

  showHide(event) {
    this.setState({show: !this.state.show});
  }

  onConnected() {

    let that = this;
    let postRequest = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jid: XMPP.jid })
    };

    fetch('/login', postRequest).then(response => {
      that.props.setView(VIEWS.MAIN_MENU);
    });

  }

  onDisconnected() {

    let that = this;
    let postRequest = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    fetch('/logout', postRequest).then(response => {
      that.props.setView(VIEWS.LOGIN);
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    XMPP.createConn();
    XMPP.connect(
      this.state.jidValue,
      this.state.passValue,
      this.onConnected,
      this.onDisconnected
    );
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <label>
            JID:
            <input
              type="text"
              value={this.state.jidValue}
              required
              onChange={this.handleJidChange}
            />
          </label>
          <br />
        <label>
          Contraseña:
          <input
            type={this.state.show ? "text" : "password"}
            value={this.state.passValue}
            onChange={this.handlePassChange}
          />
          <button type="button" onClick={this.showHide}>
            {this.state.show ? "Ocultar" : "Mostrar"}
          </button>
        </label>
          <br />
          <input type="submit" value="Identificarse" />
        </form>
      </div>
    );
  }
}

export default Login;

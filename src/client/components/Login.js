import React, { Component } from 'react';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import { VIEWS } from '../constants';
import XMPP from '../xmpp';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jidValue: '',
      passValue: '',
      showHidePass: false,
      sendPresence: false,
      submitVisible: true
    };
    this.handleJidChange = this.handleJidChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSendPresenceChange = this.handleSendPresenceChange.bind(this);
    this.showHide = this.showHide.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onConnecting = this.onConnecting.bind(this);
    this.onConnected = this.onConnected.bind(this);
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  handleJidChange(event) {
    this.setState({jidValue: event.target.value});
  }

  handlePassChange(event) {
    this.setState({passValue: event.target.value});
  }

  handleSendPresenceChange(event) {
    this.setState({sendPresence: event.target.checked});
  }

  showHide(event) {
    this.setState({showHidePass: !this.state.showHidePass});
  }

  onConnected() {

    let that = this;
    let postRequest = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
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
        'Content-Type': 'application/json'
      }
    };

    fetch('/logout', postRequest).then(response => {
      that.props.setView(VIEWS.LOGIN);
      that.setState({submitVisible: true});
    });

  }

  onConnecting() {
    this.setState({submitVisible: false});
  }

  handleSubmit(event) {
    event.preventDefault();
    XMPP.createConn();
    XMPP.connect(
      this.state.jidValue,
      this.state.passValue,
      this.state.sendPresence,
      this.onConnected,
      this.onDisconnected,
      this.onConnecting
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
              type={this.state.showHidePass ? "text" : "password"}
              value={this.state.passValue}
              onChange={this.handlePassChange}
            />
            <button type="button" onClick={this.showHide}>
              {this.state.showHidePass ? "Ocultar" : "Mostrar"}
            </button>
          </label>
          <br />
          <label>
            Enviar presencia:
            <input
              type="checkbox"
              checked={this.state.sendPresence}
              onChange={this.handleSendPresenceChange}
            />
          </label>
          <br />
          {
            this.state.submitVisible
            ? <input type="submit" value="Identificarse" />
            : "Conectando..."
          }
        </form>
      </div>
    );
  }
}

export default Login;

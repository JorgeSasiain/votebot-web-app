import React, { Component } from 'react';
import { VIEWS } from './IndexPage';
import XMPP from '../xmpp/xmpp';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {jidValue: '', passValue: ''};
    this.handleJidChange = this.handleJidChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
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

  onConnected() {
    this.props.setView(VIEWS.MAIN_MENU);
  }

  onDisconnected() {
    this.props.setView(VIEWS.LOGIN);
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
              type="text"
              value={this.state.passValue}
              onChange={this.handlePassChange}
            />
          </label>
          <br />
          <input type="submit" value="Identificarse" />
        </form>
      </div>
    );
  }
}

export default Login;
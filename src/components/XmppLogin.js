import React, { Component } from 'react';
import xmpp from '../xmpp/xmpp';

class JidPassForm extends Component {

  constructor(props) {
    super(props);
    this.state = {jidValue: '', passValue: ''};
    this.handleJidChange = this.handleJidChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.onConnected = this.onConnected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleJidChange(event) {
    this.setState({jidValue: event.target.value});
  }

  handlePassChange(event) {
    this.setState({passValue: event.target.value});
  }

  onConnected() {
    this.props.setLoggedIn(true);
  }

  handleSubmit(event) {
    event.preventDefault();
    let conn = xmpp.createConn();
    this.props.setConn(conn);
    xmpp.connect(conn, this.state.jidValue, this.state.passValue, this.onConnected);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          JID:
          <input
            type="text"
            value={this.state.jidValue}
            onChange={this.handleJidChange}
          />
        </label>
        <label>
          Contraseña:
          <input
            type="text"
            value={this.state.passValue}
            onChange={this.handlePassChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class XmppLogin extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Xmpp-login">
      	<JidPassForm setConn={this.props.setConn} setLoggedIn={this.props.setLoggedIn} />
      </div>
    );
  }
}

export default XmppLogin;
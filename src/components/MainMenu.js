import React, { Component } from 'react';
import xmpp from '../xmpp/xmpp';

class SubmitButton extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {

    event.preventDefault();

    /* Create new poll */
    if (this.props.id === '1') {

    }

    /* Manage active polls */
    if (this.props.id === '2') {

    }

    /* Logout */
    if (this.props.id === '3') {
      this.props.setLoggedIn(false);
      xmpp.disconnect(this.props.conn, "User logged out");
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value={this.props.value} />
      </form>
    );
  }
}

class MainMenu extends Component {
  render() {
    return (
      <div className="Main-menu">
        <SubmitButton id='1' value="Create new poll" conn={this.props.conn} setLoggedIn={this.props.setLoggedIn} />
        <SubmitButton id='2' value="Manage active polls" conn={this.props.conn} setLoggedIn={this.props.setLoggedIn} />
        <SubmitButton id='3' value="Logout" conn={this.props.conn} setLoggedIn={this.props.setLoggedIn} />
      </div>
    );
  }
}

export default MainMenu;
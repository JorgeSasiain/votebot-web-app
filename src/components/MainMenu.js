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
    xmpp.getRoster(this.props.conn);
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
        <SubmitButton value="Create new poll" conn={this.props.conn} />
        <SubmitButton value="Manage active polls" conn={this.props.conn} />
        <SubmitButton value="Logout" conn={this.props.conn} />
      </div>
    );
  }
}

export default MainMenu;
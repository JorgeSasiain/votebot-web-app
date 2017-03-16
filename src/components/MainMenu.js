import React, { Component } from 'react';
import { Link } from 'react-router';
import xmpp from '../xmpp/xmpp';

class SubmitButton extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.setLoggedIn(false);
    xmpp.disconnect(this.props.conn, "User logged out");
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value={this.props.value} />
      </form>
    );
  }
}

class LinkButton extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Link to={this.props.linkto}>
        <button type="button">
          {this.props.value}
        </button>
      </Link>
    );
  }
}

class MainMenu extends Component {
  render() {
    return (
      <div className="Main-menu">
        <LinkButton value="Crear nueva encuesta" linkto="/newpoll" />
        <LinkButton value="Gestionar encuestas activas" linkto="/manage" />
        <SubmitButton value="Salir" conn={this.props.conn} setLoggedIn={this.props.setLoggedIn} />
      </div>
    );
  }
}

export default MainMenu;
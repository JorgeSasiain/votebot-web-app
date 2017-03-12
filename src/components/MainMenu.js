import React, { Component } from 'react';

class SubmitButton extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
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
        <SubmitButton value="Create new poll" />
        <SubmitButton value="Manage active polls" />
        <SubmitButton value="Logout" />
      </div>
    );
  }
}

export default MainMenu;
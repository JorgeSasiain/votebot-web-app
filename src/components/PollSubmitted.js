import React, { Component } from 'react';
import { VIEWS } from './constants';

class PollSubmitted extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.toMainMenu = this.toMainMenu.bind(this);
  }

  toMainMenu(event) {
    event.preventDefault();
    this.props.setView(VIEWS.MAIN_MENU);
  }

  render() {
    return (
      <div className="Poll-submitted">
        <form onSubmit={this.toMainMenu}>
          <input type="submit" value="Menú principal" />
        </form>
      </div>
    );
  }
}

export default PollSubmitted;

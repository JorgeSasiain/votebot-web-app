import React, { Component } from 'react';
import XmppLogin from './XmppLogin';
import MainMenu from './MainMenu';

class IndexPage extends Component {

  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false};
    this.setLoggedIn = this.setLoggedIn.bind(this);
  }

  setLoggedIn() {
    this.setState({isLoggedIn: true});
  }

  render() {
    return (
      <div className="Index-page">
        { this.state.isLoggedIn ? <MainMenu /> : <XmppLogin setLoggedIn={this.setLoggedIn} /> }
      </div>
    );
  }
}

export default IndexPage;
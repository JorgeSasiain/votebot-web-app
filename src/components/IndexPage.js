import React, { Component } from 'react';
import XmppLogin from './XmppLogin';
import MainMenu from './MainMenu';

class IndexPage extends Component {

  constructor(props) {
    super(props);
    this.state = {conn: {}, isLoggedIn: false};
    this.setLoggedIn = this.setLoggedIn.bind(this);
  }

  setLoggedIn(bool) {
    this.setState({isLoggedIn: bool});
  }

  render() {
    return (
      <div className="Index-page">
        {
          this.state.isLoggedIn
          ? <MainMenu setLoggedIn={this.setLoggedIn} />
          : <XmppLogin setLoggedIn={this.setLoggedIn} />
        }
      </div>
    );
  }
}

export default IndexPage;
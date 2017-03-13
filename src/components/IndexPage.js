import React, { Component } from 'react';
import XmppLogin from './XmppLogin';
import MainMenu from './MainMenu';

class IndexPage extends Component {

  constructor(props) {
    super(props);
    this.state = {conn: {}, isLoggedIn: false};
    this.setConn = this.setConn.bind(this);
    this.setLoggedIn = this.setLoggedIn.bind(this);
  }

  setConn(conn) {
    this.setState({conn: this.conn});
  }

  setLoggedIn() {
    this.setState({isLoggedIn: true});
  }

  render() {
    return (
      <div className="Index-page">
        {
          this.state.isLoggedIn
          ? <MainMenu conn={this.state.conn} />
          : <XmppLogin setConn={this.setConn} setLoggedIn={this.setLoggedIn} />
        }
      </div>
    );
  }
}

export default IndexPage;
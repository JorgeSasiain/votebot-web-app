import React, { Component } from 'react';
import XmppLogin from './XmppLogin';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header"></div>
        <div className="App-intro"></div>
        <div className="App-body">
          <XmppLogin />
        </div>
      </div>
    );
  }
}

export default App;

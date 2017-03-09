import React, { Component } from 'react';

class JidPassLabels extends Component {

  constructor(props) {
    super(props);
    this.state = {jidValue: '', passValue: ''};

    this.handleJidChange = this.handleJidChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleJidChange(event) {
    this.setState({jidValue: event.target.value});
  }

  handlePassChange(event) {
    this.setState({passValue: event.target.value});
  }

  handleSubmit(event) {
    alert('Submitted ' + this.state.jidValue + ' ' + this.state.passValue);
    event.preventDefault();
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
          Password:
          <input
            type="text"
            value={this.props.passValue}
            onChange={this.handlePassChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class XmppLogin extends Component {
  render() {
  	return (
      <div className="Xmpp-login">
      	<JidPassLabels />
      </div>
  	);
  }
}

export default XmppLogin;
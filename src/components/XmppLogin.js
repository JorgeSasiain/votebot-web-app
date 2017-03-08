import React, { Component } from 'react';

class NameForm extends Component {

  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value}); 
  }

  handleSubmit(event) {
    alert('Submitted ' + this.props.label + ' ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {this.props.label}
          <input type="text" value={this.state.value} onChange={this.handleChange} />
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
      	<NameForm label="     JID: "/>
      	<NameForm label="Password: "/>
      </div>
  	);
  }
}

export default XmppLogin;
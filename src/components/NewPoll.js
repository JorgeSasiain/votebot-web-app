import React, { Component } from 'react';
import xmpp from '../xmpp/xmpp';

class NewPollLabel extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <label>
        {this.props.label}
        <input
          type="text"
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </label>
    );
  }
}

class NewPollForm extends Component {

  constructor(props) {
    super(props);
    this.state = {question: '', choice1: '', choice2: '', choice3: ''};
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleChoice1Change = this.handleChoice1Change.bind(this);
    this.handleChoice2Change = this.handleChoice2Change.bind(this);
    this.handleChoice3Change = this.handleChoice3Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleQuestionChange(event) {
    this.setState({question: event.target.value});
  }

  handleChoice1Change(event) {
    this.setState({choice1: event.target.value});
  }

  handleChoice2Change(event) {
    this.setState({choice2: event.target.value});
  }

  handleChoice3Change(event) {
    this.setState({choice3: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    xmpp.getVotebotsInRoster();
    setTimeout(function(){ xmpp.sendTestMessage(); }, 5000);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <NewPollLabel label="Pregunta:" value={this.state.question} onChange={this.handleQuestionChange} />
        <NewPollLabel label="Opción 1:" value={this.state.choice1} onChange={this.handleChoice1Change} />
        <NewPollLabel label="Opción 2:" value={this.state.choice2} onChange={this.handleChoice2Change} />
        <NewPollLabel label="Opción 3:" value={this.state.choice3} onChange={this.handleChoice3Change} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class NewPoll extends Component {
  render() {
    return (
      <div className="New-poll">
        <NewPollForm />
      </div>
    );
  }
}

export default NewPoll;
import React, { Component } from 'react';
import Select from 'react-select';
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

    let that = this;
    setTimeout(function() {
      that.props.setSubmitted(true);
    }, 4000);
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

let options = [];

class BotsSelectMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {bots: []};
    this.setUpOptions = this.setUpOptions.bind(this);
    this.addBot = this.addBot.bind(this);
    this.removeBot = this.removeBot.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setUpOptions();
  }

  setUpOptions() {
    let bots = xmpp.bots;
    for (let i = 0; i < bots.length; i ++) {
      options.push({value: bots[i], label: bots[i]});
    }
  }

  addBot(value) {
    this.setState({
      bots: this.state.bots.concat([value])
    });
  }

  removeBot(value) {
    this.setState({
      bots: this.state.bots.filter(function(bot) {
        return bot !== value
      })
    });
  }

  handleSelectChange(value) {
    let index = this.state.bots.indexOf(value);
    if (index == -1) {
      this.addBot(value);
    } else {
      this.removeBot(value);
    }
    alert("bots hasta ahora: " + this.state.bots);
  }

  handleSubmit(event) {
    event.preventDefault();

    let that = this;
    setTimeout(function() {
      xmpp.sendMessage(that.state.bots, "test");
    }, 4000);
  }

  render() {
    return (
      <div>
        <Select
          name="form-field-name"
          options={options}
          multi={true}
          onChange={this.handleSelectChange}
        />
        <form onSubmit={this.handleSubmit}>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

class NewPoll extends Component {

  constructor(props) {
    super(props);
    this.state = {submitted: false};
    this.setSubmitted = this.setSubmitted.bind(this);
  }

  setSubmitted(bool) {
    this.setState({submitted: bool});
  }

  render() {
    return (
      <div className="New-poll">
      {
        this.state.submitted
        ? <BotsSelectMenu />
        : <NewPollForm setSubmitted={this.setSubmitted}/>
      }
      </div>
    );
  }
}

export default NewPoll;
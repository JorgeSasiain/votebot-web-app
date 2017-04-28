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
    this.onGotRosterAndMUCs = this.onGotRosterAndMUCs.bind(this);
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

  onGotRosterAndMUCs() {
    this.props.setContactsSelectMenu(true);
  }

  handleSubmit(event) {
    event.preventDefault();
    xmpp.getRosterAndMUCs(this.onGotRosterAndMUCs);
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

class ContactsSelectMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {mucs: [], contacts: [], options: []};
    this.setUpOptions = this.setUpOptions.bind(this);
    this.selectContact = this.selectContact.bind(this);
    this.deselectContact = this.deselectContact.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setUpOptions();
  }

  setUpOptions() {

    let contacts = xmpp.contacts;
    let pushContact = function(options, contact) {
      options.push({ value: contact, label: contact });
      return options
    }

    let options = contacts.reduce(pushContact,[]);
    this.setState({ options: options });

  }

  selectContact(value) {
    this.setState({
      contacts: this.state.contacts.concat([value])
    });
  }

  deselectContact(value) {
    this.setState({
      contacts: this.state.contacts.filter(function(contact) {
        return contact !== value
      })
    });
  }

  handleContactChange(value) {
    let index = this.state.contacts.indexOf(value);
    if (index == -1) {
      this.selectContact(value);
    } else {
      this.deselectContact(value);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Select
          name="form-field-name"
          options={this.state.options}
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
    this.state = {loadContactsSelectMenu: false};
    this.setContactsSelectMenu = this.setContactsSelectMenu.bind(this);
  }

  setContactsSelectMenu(bool) {
    this.setState({loadContactsSelectMenu: bool});
  }

  render() {
    return (
      <div className="New-poll">
      {
        this.state.loadContactsSelectMenu
        ? <ContactsSelectMenu />
        : <NewPollForm setContactsSelectMenu={this.setContactsSelectMenu}/>
      }
      </div>
    );
  }
}

export default NewPoll;
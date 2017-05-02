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
    xmpp.getRosterAndMUCsIfSupported(this.onGotRosterAndMUCs);
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
    this.state = {mucs: [], groups: [], contacts: [], options: {} };
    this.setUpOptions = this.setUpOptions.bind(this);
    this.selectContact = this.selectContact.bind(this);
    this.deselectContact = this.deselectContact.bind(this);
    this.selectMuc = this.selectMuc.bind(this);
    this.deselectMuc = this.deselectMuc.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
    this.deselectGroup = this.deselectGroup.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleMucChange = this.handleMucChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setUpOptions();
  }

  setUpOptions() {

    let contacts = xmpp.contacts;
    let mucs = xmpp.mucs;
    let groups = xmpp.groups;

    let pushItem = function(items, item) {
      items.push({ value: item, label: item });
      return items;
    }

    let _contacts = contacts.reduce(pushItem, []);
    let _mucs = mucs.reduce(pushItem, []);
    let _groups = groups.reduce(pushItem, []);
    this.setState({ options: {mucs: _mucs, groups: _groups, contacts: _contacts} });

  }

  selectContact(value) {
    this.setState({
      contacts: this.state.contacts.concat([value])
    });
  }

  deselectContact(value) {
    this.setState({
      contacts: this.state.contacts.filter(function(contact) {
        return contact !== value;
      })
    });
  }

  selectMuc(value) {
    this.setState({
      mucs: this.state.mucs.concat([value])
    });
  }

  deselectMuc(value) {
    this.setState({
      mucs: this.state.mucs.filter(function(muc) {
        return muc !== value;
      })
    });
  }

  selectGroup(value) {
    this.setState({
      groups: this.state.groups.concat([value])
    });
  }

  deselectGroup(value) {
    this.setState({
      groups: this.state.groups.filter(function(group) {
        return group !== value;
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

  handleMucChange(value) {
    let index = this.state.mucs.indexOf(value);
    if (index == -1) {
      this.selectMuc(value);
    } else {
      this.deselectMuc(value);
    }
  }

  handleGroupChange(value) {
    let index = this.state.groups.indexOf(value);
    if (index == -1) {
      this.selectGroup(value);
    } else {
      this.deselectGroup(value);
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    let that = this;
    let getUniqueContacts = function(group, index, groups) {

      let _getUniqueContacts = function(user, index, users) {
        if (that.state.contacts.indexOf(user) === -1)
          that.state.contacts.push(user);
      }

      xmpp.groupUsers[group].forEach(_getUniqueContacts);
    }

    this.state.groups.forEach(getUniqueContacts);
    let _botMessage = { poll: {}, mucs: this.state.mucs, contacts: this.state.contacts };
    let botMessage = JSON.stringify(_botMessage);
    xmpp.sendMessageToBot(botMessage);
  }

  render() {
    return (
      <div>
        <Select
          name="mucs-select"
          options={this.state.options.mucs}
          multi={true}
          onChange={this.handleMucChange}
        />
        <Select
          name="groups-select"
          options={this.state.options.groups}
          multi={true}
          onChange={this.handleGroupChange}
        />
        <Select
          name="contacts-select"
          options={this.state.options.contacts}
          multi={true}
          onChange={this.handleContactChange}
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
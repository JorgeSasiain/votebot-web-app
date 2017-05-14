import React, { Component } from 'react';
import Select from 'react-select';
import { VIEWS } from './constants';
import XMPP from '../xmpp';

class NewPoll_SelectContacts extends Component {

  constructor(props) {
    super(props);
    this.state = { groups: [], contacts: [], options: {} };
    this.setUpOptions = this.setUpOptions.bind(this);
    this.selectContact = this.selectContact.bind(this);
    this.deselectContact = this.deselectContact.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
    this.deselectGroup = this.deselectGroup.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redoPoll = this.redoPoll.bind(this);
    this.toMainMenu = this.toMainMenu.bind(this);
  }

  componentWillMount() {
    this.setUpOptions();
  }

  setUpOptions() {

    let contacts = XMPP.contacts;
    let groups = XMPP.groups;

    let pushItem = function(items, item) {
      items.push({ value: item, label: item });
      return items;
    }

    let _contacts = contacts.reduce(pushItem, []);
    let _groups = groups.reduce(pushItem, []);
    this.setState({ options: {groups: _groups, contacts: _contacts} });

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

      XMPP.groupUsers[group].forEach(_getUniqueContacts);
    }

    this.state.groups.forEach(getUniqueContacts);
    this.props.onReadyToSend(this.state.contacts, []);

  }

  redoPoll() {
    this.props.setView(VIEWS.NEW_POLL);
  }

  toMainMenu() {
    this.props.setView(VIEWS.MAIN_MENU)
  }

  render() {
    return (
      <div className="New-poll-contacts">
        Seleccione con quien compartir la votación:
        <br />
        <Select
          name="groups-select"
          placeholder="Selecciona uno o varios grupos"
          options={this.state.options.groups}
          multi={true}
          onChange={this.handleGroupChange}
        />
        <Select
          name="contacts-select"
          placeholder="Selecciona uno o varios contactos"
          options={this.state.options.contacts}
          multi={true}
          onChange={this.handleContactChange}
        />
        <form onSubmit={this.handleSubmit}>
          <input type="submit" value="Enviar" />
        </form>
        <br />
        <button type="button" onClick={this.redoPoll}>
          Rehacer encuesta
        </button>
        <button type="button" onClick={this.toMainMenu}>
          Volver al menú principal
        </button>
      </div>
    );
  }
}

export default NewPoll_SelectContacts;

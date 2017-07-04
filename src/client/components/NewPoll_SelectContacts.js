import React, { Component } from 'react';
import Select from 'react-select';
import { VIEWS } from '../constants';
import XMPP from '../xmpp';

class NewPoll_SelectContacts extends Component {

  constructor(props) {
    super(props);
    this.state = { groups: "", contacts: "", submitVisible: true };
    this.options = {};
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redoPoll = this.redoPoll.bind(this);
    this.toMainMenu = this.toMainMenu.bind(this);
  }

  componentWillMount() {

    let contacts = XMPP.contacts;
    let groups = XMPP.groups;

    let pushItem = function(items, item) {
      items.push({ value: item, label: item });
      return items;
    }

    let _contacts = contacts.reduce(pushItem, []);
    let _groups = groups.reduce(pushItem, []);
    this.options = { groups: _groups, contacts: _contacts };

  }

  handleContactChange(value) {
    this.setState({ contacts: value });
  }

  handleGroupChange(value) {
    this.setState({ groups: value });
  }

  handleSubmit(event) {

    event.preventDefault();

    this.setState({ submitVisible: false });

    let contacts = [];
    let groups = [];
    if (this.state.contacts) contacts = this.state.contacts.split(",");
    if (this.state.groups) groups = this.state.groups.split(",");

    let getUniqueContacts = function(group, index, groups) {

      let _getUniqueContacts = function(user, index, users) {
        if (contacts.indexOf(user) === -1 && user !== XMPP.votebot)
          contacts.push(user);
      }

      if (group) XMPP.groupUsers[group].forEach(_getUniqueContacts);
    }

    groups.forEach(getUniqueContacts);
    this.props.onReadyToSend(contacts);

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
        Seleccione los contactos individuales y/o grupos de contactos con quien compartir
        la votación.
        <br />
        Si un contacto es seleccionado varias veces a través de uno o mas grupos de contactos,
        la encuesta solo se compartirá una vez con dicho contacto.
        <br />
        <Select
          name="groups-select"
          placeholder="Selecciona uno o varios grupos"
          options={this.options.groups}
          value={this.state.groups}
          multi={true}
          onChange={this.handleGroupChange}
        />
        <Select
          name="contacts-select"
          placeholder="Selecciona uno o varios contactos"
          options={this.options.contacts}
          value={this.state.contacts}
          multi={true}
          onChange={this.handleContactChange}
        />
        <form onSubmit={this.handleSubmit}>
          {
            this.state.submitVisible ? <input type="submit" value="Enviar" /> : "Enviando..."
          }
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

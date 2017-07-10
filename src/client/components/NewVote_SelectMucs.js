import React, { Component } from 'react';
import Select from 'react-select';
import { VIEWS } from '../constants';
import XMPP from '../xmpp';

class NewVote_SelectMucs extends Component {

  constructor(props) {
    super(props);
    this.state = { mucs: "", submitVisible: true };
    this.options = {};
    this.handleMucChange = this.handleMucChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redoVote = this.redoVote.bind(this);
    this.toMainMenu = this.toMainMenu.bind(this);
  }

  componentWillMount() {

    let mucs = XMPP.mucs;

    let pushItem = function(items, item) {
      items.push({ value: item, label: item });
      return items;
    }

    let _mucs = mucs.reduce(pushItem, []);
    this.options = { mucs: _mucs };

  }

  handleMucChange(value) {
    this.setState({ mucs: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.mucs) {
      alert("Selecciona al menos un chat grupal.");
      return;
    }

    this.setState({ submitVisible: false });

    let mucs = [];
    if (this.state.mucs) mucs = this.state.mucs.split(",");
    this.props.onReadyToSend(mucs);
  }

  redoVote() {
    this.props.setView(VIEWS.NEW_VOTE);
  }

  toMainMenu() {
    this.props.setView(VIEWS.MAIN_MENU)
  }

  render() {
    return (
      <div className="New-vote-mucs">
        Seleccione en que chats grupales compartir la encuesta.
        <br />
        Cualquier chat grupal seleccionado que ya tenga una encuesta activa será ignorado.
        Para compartir una encuesta en una habitación protegida por contraseña, es necesario
        enviar primero un mensaje de invitación (invite) a {XMPP.votebot} indicando la
        contraseña.
        <br />
        <Select
          name="mucs-select"
          placeholder="Selecciona uno o varios chats"
          options={this.options.mucs}
          value={this.state.mucs}
          multi={true}
          onChange={this.handleMucChange}
        />
        <form onSubmit={this.handleSubmit}>
          {
            this.state.submitVisible ? <input type="submit" value="Enviar" /> : "Enviando..."
          }
        </form>
        <br />
        <button type="button" onClick={this.redoVote}>
          Rehacer encuesta
        </button>
        <button type="button" onClick={this.toMainMenu}>
          Volver al menú principal
        </button>
      </div>
    );
  }
}

export default NewVote_SelectMucs;

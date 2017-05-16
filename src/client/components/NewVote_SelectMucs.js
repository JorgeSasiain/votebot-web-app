import React, { Component } from 'react';
import Select from 'react-select';
import { VIEWS } from '../constants';
import XMPP from '../xmpp';

class NewVote_SelectMucs extends Component {

  constructor(props) {
    super(props);
    this.state = { mucs: [], options: {} };
    this.options = {};
    this.selectMuc = this.selectMuc.bind(this);
    this.deselectMuc = this.deselectMuc.bind(this);
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

  handleMucChange(value) {
    let index = this.state.mucs.indexOf(value);
    if (index == -1) {
      this.selectMuc(value);
    } else {
      this.deselectMuc(value);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onReadyToSend(this.state.mucs);
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
        Seleccione en que chats grupales compartir la votación:
        <br />
        <Select
          name="mucs-select"
          placeholder="Selecciona uno o varios chats"
          options={this.options.mucs}
          multi={true}
          onChange={this.handleMucChange}
        />
        <form onSubmit={this.handleSubmit}>
          <input type="submit" value="Enviar" />
        </form>
        <br />
        <button type="button" onClick={this.redoVote}>
          Rehacer votación
        </button>
        <button type="button" onClick={this.toMainMenu}>
          Volver al menú principal
        </button>
      </div>
    );
  }
}

export default NewVote_SelectMucs;

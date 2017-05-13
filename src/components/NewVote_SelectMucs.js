import React, { Component } from 'react';
import Select from 'react-select';
import { VIEWS } from './constants';
import XMPP from '../xmpp';

class NewVote_SelectMucs extends Component {

  constructor(props) {
    super(props);
    this.state = { mucs: [], options: {} };
    this.setUpOptions = this.setUpOptions.bind(this);
    this.selectMuc = this.selectMuc.bind(this);
    this.deselectMuc = this.deselectMuc.bind(this);
    this.handleMucChange = this.handleMucChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toPollSubmitted = this.toPollSubmitted.bind(this);
    this.redoVote = this.redoVote.bind(this);
  }

  componentWillMount() {
    this.setUpOptions();
  }

  setUpOptions() {

    let mucs = XMPP.mucs;

    let pushItem = function(items, item) {
      items.push({ value: item, label: item });
      return items;
    }

    let _mucs = mucs.reduce(pushItem, []);
    this.setState({ options: {mucs: _mucs} });

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
    this.props.onReadyToSend([], this.state.mucs);
    this.toPollSubmitted();
  }

  toPollSubmitted() {
    this.props.setView(VIEWS.POLL_SUMBITTED);
  }

  redoVote() {
    this.props.setView(VIEWS.NEW_VOTE);
  }

  render() {
    return (
      <div className="New-vote-mucs">
        Seleccione en que chats grupales compartir la votación:
        <br />
        <Select
          name="mucs-select"
          placeholder="Selecciona uno o varios chats"
          options={this.state.options.mucs}
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
        <button type="button" onClick={this.toPollSubmitted}>
          Volver al menú principal
        </button>
      </div>
    );
  }
}

export default NewVote_SelectMucs;

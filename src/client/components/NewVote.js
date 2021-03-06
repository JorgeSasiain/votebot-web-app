import React, { Component } from 'react';
import { VIEWS, QUESTION_MAX_LEN, CHOICE_MAX_LEN, DRTN } from '../constants';
import XMPP from '../xmpp';

class TextField extends Component {

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
          required
          onChange={this.props.onChange}
        />
      </label>
    );
  }
}

class NewVote extends Component {

  constructor(props) {

    super(props);

    this.state = {
      duration: DRTN.V_DEF,
      question: '',
      multiple: false,
      choices: ['', ''],
      votes: [0, 0]
    };

    this.addChoice = this.addChoice.bind(this);
    this.removeChoice = this.removeChoice.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleMultipleChange = this.handleMultipleChange.bind(this);
    this.handleChoiceChange = this.handleChoiceChange.bind(this);
    this.handleChoice1Change = this.handleChoice1Change.bind(this);
    this.handleChoice2Change = this.handleChoice2Change.bind(this);
    this.handleChoice3Change = this.handleChoice3Change.bind(this);
    this.handleChoice4Change = this.handleChoice4Change.bind(this);
    this.onGotMUCs = this.onGotMUCs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toMainMenu = this.toMainMenu.bind(this);

  }

  componentWillMount() {
    let savedData = this.props.getSavedData();
    if (savedData != null)
      this.setState(savedData);
  }

  addChoice() {
    this.setState({
      choices: this.state.choices.concat(['']),
      votes: this.state.votes.concat([0])
    });
  }

  removeChoice() {
    let choices = this.state.choices;
    choices.pop();
    let votes = this.state.votes;
    votes.pop();

    this.setState({
      choices: choices,
      votes: votes
    });
  }

  handleDurationChange(event) {
    this.setState({duration: parseInt(event.target.value)});
  }

  handleQuestionChange(event) {
    let value = event.target.value;
    if (value.length > QUESTION_MAX_LEN) return;
    this.setState({question: value});
  }

  handleMultipleChange(event) {
    this.setState({multiple: event.target.checked});
  }

  handleChoiceChange(index, value) {
    let choices = this.state.choices;
    if (value.length > CHOICE_MAX_LEN) return;
    choices[index] = value;
    this.setState({choices: choices});
  }

  handleChoice1Change(event) {
    this.handleChoiceChange(0, event.target.value);
  }

  handleChoice2Change(event) {
    this.handleChoiceChange(1, event.target.value);
  }

  handleChoice3Change(event) {
    this.handleChoiceChange(2, event.target.value);
  }

  handleChoice4Change(event) {
    this.handleChoiceChange(3, event.target.value);
  }

  onGotMUCs() {
    this.props.setView(VIEWS.NEW_VOTE_MUCS);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onNewVote(this.state);
    XMPP.getMUCsIfSupported(this.onGotMUCs);
  }

  toMainMenu() {
    this.props.setView(VIEWS.MAIN_MENU);
  }

  render() {
    return (
      <div className="New-vote">
        Introduzca la información de la encuesta:
        <br />
        <form onSubmit={this.handleSubmit}>
          <label>
            Vigencia (minutos):
            <input
              type="number"
              min={DRTN.V_MIN} max={DRTN.V_MAX} step={DRTN.V_STEP}
              value={this.state.duration}
              required
              onChange={this.handleDurationChange}
            />
          </label>
          <br />
          <TextField
            label="Pregunta:"
            value={this.state.question}
            onChange={this.handleQuestionChange}
          />
          <label>
            Elección multiple:
            <input
              type="checkbox"
              checked={this.state.multiple}
              onChange={this.handleMultipleChange}
            />
          </label>
          <br />
          <TextField
            label="Opción 1:"
            value={this.state.choices[0]}
            onChange={this.handleChoice1Change}
          />
          <TextField
            label="Opción 2:"
            value={this.state.choices[1]}
            onChange={this.handleChoice2Change}
          />
          {
            this.state.choices.length >= 3 &&
            <TextField
              label="Opción 3:"
              value={this.state.choices[2]}
              onChange={this.handleChoice3Change}
            />
          }
          {
            this.state.choices.length >= 4 &&
            <TextField
              label="Opción 4:"
              value={this.state.choices[3]}
              onChange={this.handleChoice4Change}
            />
          }
          {
            this.state.choices.length !== 4 &&
            <button type="button" onClick={this.addChoice}>+</button>
          }
          {
            this.state.choices.length !== 2 &&
            <button type="button" onClick={this.removeChoice}>-</button>
          }
          <br />
          <input type="submit" value="Confirmar" />
        </form>
        <button type="button" onClick={this.toMainMenu}>
          Volver al menú principal
        </button>
      </div>
    );
  }
}

export default NewVote;

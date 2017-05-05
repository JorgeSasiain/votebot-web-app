import React, { Component } from 'react';
import { VIEWS } from './IndexPage';
import XMPP from '../xmpp/xmpp';

class Label extends Component {

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

class PollQuestion extends Component {

  constructor(props) {

    super(props);

    this.removeQuestion = this.removeQuestion.bind(this);
    this.addChoice = this.addChoice.bind(this);
    this.removeChoice = this.removeChoice.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleChoiceChange = this.handleChoiceChange.bind(this);
    this.handleChoice1Change = this.handleChoice1Change.bind(this);
    this.handleChoice2Change = this.handleChoice2Change.bind(this);
    this.handleChoice3Change = this.handleChoice3Change.bind(this);
    this.handleChoice4Change = this.handleChoice4Change.bind(this);

  }

  removeQuestion() {
    this.props.c().removeQuestion(this.props.qid);
  }

  addChoice() {
    this.props.c().addChoice(this.props.qid);
  }

  removeChoice() {
    this.props.c().removeChoice(this.props.qid);
  }

  handleQuestionChange(event) {
    this.props.c().handleQuestionChange(this.props.qid, event);
  }

  handleChoiceChange(index, value) {
    this.props.c().handleChoiceChange(this.props.qid, index, value);
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

  render() {
    return (
      <div>
        <Label
          label="Pregunta:"
          value={this.props.c().getQuestion(this.props.qid)}
          onChange={this.handleQuestionChange}
        />
        {
          this.props.c().numQuestions() !== 1 &&
          <button type="button" onClick={this.removeQuestion}>-</button>
        }
        <br />
        <Label
          label="Opción 1:"
          value={this.props.c().getChoice(this.props.qid, 0)}
          onChange={this.handleChoice1Change}
        />
        <Label
          label="Opción 2:"
          value={this.props.c().getChoice(this.props.qid, 1)}
          onChange={this.handleChoice2Change}
        />
        {
          this.props.c().numChoices(this.props.qid) >= 3 &&
          <Label
            label="Opción 3:"
            value={this.props.c().getChoice(this.props.qid, 2)}
            onChange={this.handleChoice3Change}
          />
        }
        {
          this.props.c().numChoices(this.props.qid) >= 4 &&
          <Label
            label="Opción 4:"
            value={this.props.c().getChoice(this.props.qid, 3)}
            onChange={this.handleChoice4Change}
          />
        }
        {
          this.props.c().numChoices(this.props.qid) !== 4 &&
          <button type="button" onClick={this.addChoice}>+</button>
        }
        {
          this.props.c().numChoices(this.props.qid) !== 2 &&
          <button type="button" onClick={this.removeChoice}>-</button>
        }
        <br />
      </div>
    );
  }

}

class NewPoll extends Component {

  constructor(props) {

    super(props);

    this.state = {
      title: '',
      duration: '',
      questions: [
        {
          question: '',
          choices: ['', '']
        }
      ]
    };

    this.addQuestion = this.addQuestion.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.callbacks = this.callbacks.bind(this);
    this.onGotRoster = this.onGotRoster.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toMainMenu = this.toMainMenu.bind(this);

  }

  addQuestion() {
    let questions = this.state.questions;
    questions.push( {question: '', choices: ['', '']} );
    this.setState({questions: questions});
  }

  handleTitleChange(event) {
    this.setState({title: event.target.value});
  }

  handleDurationChange(event) {
    this.setState({duration: event.target.value});
  }

  callbacks() {

    let that = this;

    return {

      removeQuestion: function(qid) {
        let questions = that.state.questions;
        questions.splice(qid, 1);
        that.setState({questions: questions});
      }.bind(this),

      addChoice: function(qid) {
        let questions = that.state.questions;
        questions[qid].choices.push('');
        that.setState({questions: questions});
      }.bind(this),

      removeChoice: function(qid) {
        let questions = that.state.questions;
        questions[qid].choices.pop();
        that.setState({questions: questions});
      }.bind(this),

      handleQuestionChange: function(qid, event) {
        let questions = that.state.questions;
        questions[qid].question = event.target.value;
        that.setState({questions: questions});
      }.bind(this),

      handleChoiceChange: function(qid, index, value) {
        let questions = that.state.questions;
        questions[qid].choices[index] = event.target.value;
        that.setState({questions: questions});
      }.bind(this),

      getQuestion: function(qid) { return that.state.questions[qid].question }.bind(this),

      getChoice: function(qid, index) {
        return that.state.questions[qid].choices[index];
      }.bind(this),

      numQuestions: function() { return that.state.questions.length }.bind(this),

      numChoices: function(qid) { return that.state.questions[qid].choices.length }.bind(this)

    }

  }

  onGotRoster() {
    this.props.setView(VIEWS.NEW_POLL_CONTACTS);
  }

  handleSubmit() {
    event.preventDefault();
    this.props.onNewPoll(this.state);
    XMPP.getContactsAndGroups(this.onGotRoster);
  }

  toMainMenu() {
    this.props.setView(VIEWS.MAIN_MENU);
  }

  render() {
    return (
      <div className="New-poll">
        Introduzca la información de la encuesta:
        <br />
        <form onSubmit={this.handleSubmit}>
          <Label
            label="Título:"
            value={this.state.title}
            onChange={this.handleTitleChange}
          />
          <br />
          <Label
            label="Vigencia:"
            value={this.state.duration}
            onChange={this.handleDurationChange}
          />
          <br />
          <PollQuestion qid={0} c={this.callbacks} />
          { this.state.questions.length > 1 && <PollQuestion qid={1} c={this.callbacks} /> }
          { this.state.questions.length > 2 && <PollQuestion qid={2} c={this.callbacks} /> }
          { this.state.questions.length > 3 && <PollQuestion qid={3} c={this.callbacks} /> }
          { this.state.questions.length > 4 && <PollQuestion qid={4} c={this.callbacks} /> }
          { this.state.questions.length > 5 && <PollQuestion qid={5} c={this.callbacks} /> }
          { this.state.questions.length > 6 && <PollQuestion qid={6} c={this.callbacks} /> }
          { this.state.questions.length > 7 && <PollQuestion qid={7} c={this.callbacks} /> }
          { this.state.questions.length > 8 && <PollQuestion qid={8} c={this.callbacks} /> }
          { this.state.questions.length > 9 && <PollQuestion qid={9} c={this.callbacks} /> }
          {
            this.state.questions.length !== 10 &&
            <button type="button" onClick={this.addQuestion}>+</button>
          }
          <input type="submit" value="Confirmar" />
        </form>
        <button type="button" onClick={this.toMainMenu}>
          Volver al menú principal
        </button>
      </div>
    );
  }
}

export default NewPoll;

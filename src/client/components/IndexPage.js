import React, { Component } from 'react';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import Login from './Login';
import MainMenu from './MainMenu';
import NewVote from './NewVote';
import NewVote_SelectMucs from './NewVote_SelectMucs';
import NewPoll from './NewPoll';
import NewPoll_SelectContacts from './NewPoll_SelectContacts';
import ManagePolls from './ManagePolls';
import PollSubmitted from './PollSubmitted';
import { VIEWS, ONE_HOUR } from '../constants';
import XMPP from '../xmpp';

class IndexPage extends Component {

  constructor(props) {

    super(props);

    this.state = {
      view: 0,
      savedData: null,
      poll: {},
      pollActive: {}
    };

    this.setView = this.setView.bind(this);
    this.getSavedData = this.getSavedData.bind(this);
    this.onNewVote = this.onNewVote.bind(this);
    this.onNewPoll = this.onNewPoll.bind(this);
    this.onReadyToSendVote = this.onReadyToSendVote.bind(this);
    this.onReadyToSendPoll = this.onReadyToSendPoll.bind(this);

  }

  setView(view) {
    this.setState({view: view});
  }

  getSavedData() {
    return this.state.savedData;
  }

  getExpirationDate(ttl) {

    let curDate = new Date()
    let curTime = 0, expTime = 0;

    curTime = curDate.getTime();
    expTime = curTime + ttl;

    return expTime;
  }

  onNewVote(voteInfo) {

    let expireAt = this.getExpirationDate(voteInfo.duration * ONE_HOUR);

    let poll = {
      creator: XMPP.jid,
      title: voteInfo.title,
      private: false,
      expireAt: expireAt,
      hidden: false,
      questions: [
        {
          question: voteInfo.question,
          multiple: false,
          choices: voteInfo.choices,
          votes: voteInfo.votes
        }
      ]
    };

    this.setState({ poll: poll, pollActive: {}, savedData: voteInfo });

  }

  onNewPoll(pollInfo) {

    let inactiveAt = this.getExpirationDate(pollInfo.duration * ONE_HOUR)
    let expireAt = this.getExpirationDate((pollInfo.duration + 24) * ONE_HOUR);

    let poll = {
      _id: 0,
      creator: XMPP.jid,
      title: pollInfo.title,
      private: true,
      expireAt: expireAt,
      hidden: false,
      questions: pollInfo.questions
    };

    let pollActive = {
      poll_id: 0,
      inactiveAt: inactiveAt
    }

    this.setState({ poll: poll, pollActive: pollActive, savedData: pollInfo });

  }

  onReadyToSendVote(mucs) {

    let requestBody = JSON.stringify(this.state.poll);

    let postRequest = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: requestBody
    };

    let botMessage = {
      pollTitle: this.state.poll.title,
      mucs: mucs
    };

    fetch('/polls', postRequest).then(response => {
      if (response.status >= 400) return;
      XMPP.sendMessageToBot(JSON.stringify(botMessage));
      this.setState({
        view: VIEWS.POLL_SUMBITTED,
        savedData: null,
        poll: {},
        pollActive: {},
      });
    });

  }

  onReadyToSendPoll(contacts) {

    let requestBody = JSON.stringify(this.state.poll);
    let requestBody2 = JSON.stringify(this.state.pollActive);

    let postRequest = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: requestBody
    };

    let postRequest2 = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: requestBody2
    };

    let botMessage = {
      pollTitle: this.state.poll.title,
      contacts: contacts
    };

    fetch('/polls', postRequest).then(response => {
      if (response.status >= 400) return;

      fetch('/polls2', postRequest2).then(response => {
        if (response.status >= 400) return;
        XMPP.sendMessageToBot(JSON.stringify(botMessage));
        this.setState({
          view: VIEWS.POLL_SUMBITTED,
          savedData: null,
          poll: {},
          pollActive: {}
        });
      });

    });

  }

  render() {
    return (
      <div className="Index-page">
        {
          {
            0: <Login setView={this.setView} />,
            1: <MainMenu setView={this.setView} />,
            2:
            <NewVote
              setView={this.setView}
              onNewVote={this.onNewVote}
              getSavedData={this.getSavedData}
            />,
            3:
            <NewVote_SelectMucs
              setView={this.setView}
              onReadyToSend={this.onReadyToSendVote}
            />,
            4:
            <NewPoll
              setView={this.setView}
              onNewPoll={this.onNewPoll}
              getSavedData={this.getSavedData}
            />,
            5:
            <NewPoll_SelectContacts
              setView={this.setView}
              onReadyToSend={this.onReadyToSendPoll}
            />,
            6: <ManagePolls setView={this.setView} />,
            7: <PollSubmitted setView={this.setView} />
          }[this.state.view]
        }
      </div>
    );
  }
}

export default IndexPage;

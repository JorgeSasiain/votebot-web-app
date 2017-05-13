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
import XMPP from '../xmpp/xmpp';

export const VIEWS = {
  LOGIN: 0,
  MAIN_MENU: 1,
  NEW_VOTE: 2,
  NEW_VOTE_MUCS: 3,
  NEW_POLL: 4,
  NEW_POLL_CONTACTS: 5,
  MANAGE_POLLS: 6,
  POLL_SUMBITTED: 7
};

class IndexPage extends Component {

  constructor(props) {

    super(props);

    this.state = {
      view: 0,
      poll: {
        creator: '',
        title: '',
        duration: 0,
        hidden: false,
        questions: []
      },
      pollActive: {},
      targets: {
        contacts: [],
        mucs: []
      }
    };

    this.setView = this.setView.bind(this);
    this.onNewVote = this.onNewVote.bind(this);
    this.onNewPoll = this.onNewPoll.bind(this);
    this.onReadyToSend = this.onReadyToSend.bind(this);
    this.onReadyToSendVote = this.onReadyToSendVote.bind(this);
    this.onReadyToSendPoll = this.onReadyToSendPoll.bind(this);

  }

  setView(view) {
    this.setState({view: view});
  }

  getExpirationDate(ttl) {

    let curDate = new Date()
    let curTime = 0, expTime = 0;

    curTime = curDate.getTime();
    expTime = curTime + ttl;

    return expTime;
  }

  onNewVote(voteInfo) {

    let expireAt = this.getExpirationDate(voteInfo.duration * 3600000);

    let poll = {
      creator: XMPP.jid,
      title: voteInfo.title,
      type: "public",
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

    this.setState({ poll: poll, pollActive: {} });

  }

  onNewPoll(pollInfo) {

    let inactiveAt = this.getExpirationDate(pollInfo.duration * 3600000)
    let expireAt = this.getExpirationDate(pollInfo.duration * 3600000 + 86400000);

    let poll = {
      _id: 0,
      creator: XMPP.jid,
      title: pollInfo.title,
      type: "private",
      expireAt: expireAt,
      hidden: false,
      questions: pollInfo.questions
    };

    let pollActive = {
      poll_id: 0,
      inactiveAt: inactiveAt
    }

    this.setState({ poll: poll, pollActive: pollActive });

  }

  onReadyToSend(requestBody, botMessage) {

    let postRequest = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: requestBody
    };

    fetch('/db', postRequest).then(response => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      XMPP.sendMessageToBot(JSON.stringify(botMessage));
    });

  }

  onReadyToSendVote(mucs) {

    let requestBody = JSON.stringify({
      poll: this.state.poll
    });

    let botMessage = {
      mucs: mucs
    };

    this.onReadyToSend(requestBody, botMessage);

  }

  onReadyToSendPoll(contacts) {

    let requestBody = JSON.stringify({
      poll: this.state.poll,
      pollActive: this.state.pollActive
    });

    let botMessage = {
      contacts: contacts
    };

    this.onReadyToSend(requestBody, botMessage);

  }

  render() {
    return (
      <div className="Index-page">
        {
          {
            0: <Login setView={this.setView} />,
            1: <MainMenu setView={this.setView} />,
            2: <NewVote setView={this.setView} onNewVote={this.onNewVote} />,
            3:
            <NewVote_SelectMucs
              setView={this.setView}
              onReadyToSend={this.onReadyToSendVote}
            />,
            4: <NewPoll setView={this.setView} onNewPoll={this.onNewPoll} />,
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

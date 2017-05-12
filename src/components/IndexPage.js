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
      targets: {
        contacts: [],
        mucs: []
      }
    };

    this.setView = this.setView.bind(this);
    this.onNewVote = this.onNewVote.bind(this);
    this.onNewPoll = this.onNewPoll.bind(this);
    this.onReadyToSend = this.onReadyToSend.bind(this);
    this.getExpirationDate = this.getExpirationDate.bind(this);

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

    this.setState({poll: poll});

  }

  onNewPoll(pollInfo) {

    let expireAt = this.getExpirationDate(pollInfo.duration * 3600000);

    let poll = {
      creator: XMPP.jid,
      title: pollInfo.title,
      type: "private",
      expireAt: expireAt,
      hidden: false,
      questions: pollInfo.questions
    };

    this.setState({poll: poll});

  }

  onReadyToSend(contacts, mucs) {

    let _botMessage = {
      targets: {
        contacts: contacts,
        mucs: mucs
      }
    };
    let botMessage = JSON.stringify(_botMessage);
    XMPP.sendMessageToBot(botMessage);

    let dbDoc = JSON.stringify(this.state.poll);
    let postRequest = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: dbDoc
    }
    fetch('/poll', postRequest).then(response => console.log(response));

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
              onReadyToSend={this.onReadyToSend}
            />,
            4: <NewPoll setView={this.setView} onNewPoll={this.onNewPoll} />,
            5:
            <NewPoll_SelectContacts
              setView={this.setView}
              onReadyToSend={this.onReadyToSend}
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

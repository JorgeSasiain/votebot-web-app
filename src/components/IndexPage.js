import React, { Component } from 'react';
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

  }

  setView(view) {
    this.setState({view: view});
  }

  onNewVote(voteInfo) {

    let poll = {
      creator: XMPP.jid,
      title: voteInfo.title,
      type: "public",
      duration: voteInfo.duration,
      hidden: false,
      questions: [
        {
          question: voteInfo.question,
          multiple: false,
          choices: voteInfo.choices
        }
      ]
    };

    this.setState({poll: poll});

  }

  onNewPoll(pollInfo) {

    let poll = {
      creator: XMPP.jid,
      title: pollInfo.title,
      type: "private",
      duration: pollInfo.duration,
      hidden: false,
      questions: pollInfo.questions
    };

    this.setState({poll: poll});

  }

  onReadyToSend(contacts, mucs) {

    let that = this;
    let _botMessage = {
      poll: that.state.poll,
      targets: {
        contacts: contacts,
        mucs: mucs
      }
    };

    let botMessage = JSON.stringify(_botMessage);
    XMPP.sendMessageToBot(botMessage);

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

import React, { Component } from 'react';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import XMPP from '../xmpp';

class ManagePolls extends Component {

  constructor(props) {
    super(props);
    this.state = {polls: []};
    this.responseJson = {};
  }

  componentDidMount() {

    let getRequest = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    };

    fetch('/polls/'+XMPP.jid, getRequest).then(response => {
      if (response.status >= 400) return;
      return response.json();
    }).then(data => {
      this.responseJson = data;
    });

  }

  render() {
    return (
      <div className="Manage-polls">
      </div>
    );
  }
}

export default ManagePolls;

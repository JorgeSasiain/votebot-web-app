import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Layout from './Layout'
import IndexPage from './IndexPage';
import NewPoll from './NewPoll';
import ManagePolls from './ManagePolls';

export default class Routes extends React.Component {
  render() {
    return (
      <Router history={hashHistory} onUpdate={() => window.scrollTo(0, 0)}>
        <Route path="/" component={Layout}>
          <IndexRoute component={IndexPage} />
          <Route path="newpoll" component={NewPoll} />
          <Route path="manage" component={ManagePolls} />
        </Route>
      </Router>
    );
  }
}
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './client/components/Layout'
import IndexPage from './client/components/IndexPage';

export default class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
        <Route path="/" component={Layout}>
          <IndexRoute component={IndexPage} />
        </Route>
      </Router>
    );
  }
}


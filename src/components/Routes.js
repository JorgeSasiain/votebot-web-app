import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './Layout'
import LoginPage from './LoginPage';
import MainMenuPage from './MainMenuPage';

export default class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
        <Route path="/" component={Layout}>
          <IndexRoute component={LoginPage} />
          <Route path="main" component={MainMenuPage} />
        </Route>
      </Router>
    );
  }
}
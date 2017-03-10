import React from 'react'
import { Route, IndexRoute } from 'react-router'
import LoginPage from './components/LoginPage';

const routes = (
  <Route path="*" component={LoginPage}>
  </Route>
);

export default routes;
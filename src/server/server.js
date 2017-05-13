import path from 'path';
import { Server } from 'http';
import Express from 'express';
import bodyParser from 'body-parser';
import Mongo from './mongo';
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../components/Routes'

const app = new Express();
const server = new Server(app);
const PORT = process.env.PORT || 3000;

app.use(Express.static(path.join(__dirname, '../static')));

/* Parse the body (req.body) of all requests as JSON */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

Mongo.connect();

/* Requests for DB operations */
app.get('/db', function(req, res) {
  res.status(404).send('Not Found');
});

app.post('/db', function(req, res) {
  Mongo.addPoll(req.body);
  res.sendStatus(200);
});

/* Server-side rendering */
app.get('*', (req, res) => {
  match({ routes: routes, location: req.url }, (err, redirect, props) => {

    /* Route matching error */
    if (err) {
      res.status(500).send(err.message);

    /* Redirect */
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search);

    /* Route match */
    } else if (props) {
      const markup = renderToString(<RouterContext {...props}/>);
      res.render('index', {markup});

    /* No match */
    } else {
      res.status(404).send('Not Found');
    }

  })
});

server.listen(PORT, err => {
  if (err) return console.error(err);
  console.info("Server running on port " + PORT);
});

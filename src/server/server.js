import path from 'path';
import { Server } from 'http';
import Express from 'express';
import bodyParser from 'body-parser';
import Mongo from './mongo';
import { ObjectID } from 'mongodb';
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../components/Routes'

const app = new Express();
const server = new Server(app);
const PORT = process.env.PORT || 3000;
let POLL_ID = 0;

app.use(Express.static(path.join(__dirname, '../static')));

/* Parse the body (req.body) of all requests as JSON */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Requests for DB operations */
app.get('/polls/:user', function(req, res) {
  Mongo.getPollsByCreator(req.params.user, res);
});

app.post('/polls', function(req, res) {
  POLL_ID = new ObjectID();
  req.body._id = POLL_ID;
  Mongo.addPoll(req.body, res);
});

app.post('/polls2', function(req, res) {
  req.body.poll_id = POLL_ID;
  if (POLL_ID !== 0) {
    Mongo.addActivePeriod(req.body, res);
    POLL_ID = 0;
  } else {
    res.sendStatus(400); /* IDs don't match */
  }
});

/* Server-side rendering */
app.get('*', (req, res) => {
  match({ routes: routes, location: req.url }, (err, redirect, props) => {

    /* Route matching error */
    if (err) {
      res.status(500).send('<p>500 Internal Server Error</p><br/><a href="..">Volver</a>');

    /* Redirect */
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search);

    /* Route match */
    } else if (props) {
      const markup = renderToString(<RouterContext {...props}/>);
      res.render('index', {markup});

    /* No match */
    } else {
      res.status(404).send('<p>404 Not Found</p><br/><a href="..">Volver</a>');
    }

  })
});

server.listen(PORT, err => {
  if (err) return console.error(err);
  console.info("Server running on port " + PORT);
});

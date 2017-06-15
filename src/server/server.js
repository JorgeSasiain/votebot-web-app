import path from 'path';
import { Server } from 'http';
import Express from 'express';
import bodyParser from 'body-parser';
import Mongo from './mongo';
import { ObjectID } from 'mongodb';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../Routes';

const app = new Express();
const server = new Server(app);
const PORT = process.env.PORT || 3000;
let session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/* Static files */
app.use(Express.static(path.join(__dirname, '../static')));

/* Parse the body (req.body) of all requests as JSON */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Session */
app.use(session({
  secret: 'hEe7PvZQNkvL7mzp',
  store: new MongoStore({ url: Mongo.MONGO_URI }),
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}));

/*Login and logout */
app.post('/login', (req, res) => {
  session = req.session;
  session.jid = req.body.jid;
  res.sendStatus(200);
});

app.post('/logout', (req, res) => {
  session = req.session;
  session.destroy(function(err){ });
  res.sendStatus(200);
});

/* Requests for DB operations */

/* Get polls of user */
app.get('/polls', (req, res) => {
  session = req.session;
  if (!session.jid) {
    res.sendStatus(401);
    return;
  }
  Mongo.getPollsByCreator(session.jid, res);
});

/* Insert new poll */
app.post('/polls', (req, res) => {
  session = req.session;
  if (session.jid !== req.body.creator) {
    res.sendStatus(401);
    return;
  }
  req.body._id = new ObjectID();
  Mongo.addPoll(req.body, res);
});

/* Delete poll */
app.delete('/polls/:id', (req, res) => {
  session = req.session;
  if (!session.jid) {
    res.sendStatus(401);
    return;
  }
  Mongo.deletePollByID(new ObjectID(req.params.id), res);
});

/* Update time to live of poll */
app.put('/polls/:id', (req, res) => {
  session = req.session;
  if (!session.jid) {
    res.sendStatus(401);
    return;
  }
  Mongo.updatePollTTLByID(new ObjectID(req.params.id), req.body.date, res);
})

/* Server-side rendering */
app.get('*', (req, res) => {

  /* Match routes to URL */
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

/* Start server */
server.listen(PORT, err => {
  if (err) return console.error(err);
  console.info("Server running on port " + PORT);
});

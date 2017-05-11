import path from 'path';
import { Server } from 'http';
import Express from 'express';
import bodyParser from 'body-parser';
import Mongo from './mongo';

const app = new Express();
const server = new Server(app);
const PORT = process.env.PORT || 3000;

app.use(Express.static(path.join(__dirname, '../static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

Mongo.connect();

app.post('/poll', function(req, res) {
  console.log(req.body);
  let poll = req.body;
  Mongo.addPoll(poll);
})

server.listen(PORT, err => {
  if (err) return console.error(err);
  console.info("Server running on port " + PORT);
});

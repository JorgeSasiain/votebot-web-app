import path from 'path';
import { Server } from 'http';
import Express from 'express';
import Mongo from './mongo';

const app = new Express();
const server = new Server(app);
const PORT = process.env.PORT || 3000;

app.use(Express.static(path.join(__dirname, '../static')));

server.listen(PORT, err => {
  if (err) {
    return console.error(err);
  }
  console.info("Server running on port " + PORT);
});

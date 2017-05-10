const MongoClient = require('mongodb').MongoClient;
import { MONGO_URI } from './mongoCredentials.js';

const Mongo = {

  MONGO_URI: MONGO_URI,

  db: {},

  connect: function() {
    Mongo.db = MongoClient.connect(MONGO_URI, function(err, db) {
      if (err !== null) alert("err");
      if (db === null) alert("db-null");
      Mongo.db = db;
    });
  }

};

module.exports = Mongo;

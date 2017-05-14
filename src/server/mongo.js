import { MongoClient } from 'mongodb';

let MONGO_URI = '';
try {
  MONGO_URI = require('./mongoUri').MONGO_URI;
} catch (ex) {
  MONGO_URI = process.env.MONGO_URI;
}

const Mongo = {

  MONGO_URI: MONGO_URI,

  db: null,

  connect: function(callback, param) {

    if (Mongo.db) {
      callback(param);
      return;
    }

    Mongo.db = MongoClient.connect(Mongo.MONGO_URI, function(err, db) {
      if (err) {
        console.error(err);
        throw err;
      }
      Mongo.db = db;
      callback(param);
    });

  },

  close: function() {
    if (Mongo.db) {
      Mongo.db.close(function(err, result) {
        Mongo.db = null;
      });
    }
  },

  addPoll: function(doc, res) {

    let _addPoll = function(doc) {
      Mongo.db.collection('polls').insert(doc, function (err, result) {
        if (err || !result) res.sendStatus(422);
        else res.sendStatus(200);
      });
    };

    doc.expireAt = new Date(doc.expireAt);
    Mongo.connect(_addPoll, doc);

  },

  addActivePeriod: function(doc, res) {

    let _addActivePeriod = function(doc) {
      Mongo.db.collection('active_polls').insert(doc, function (err, result) {
        if (err || !result) res.sendStatus(422);
        else res.sendStatus(200);
      });
    }

    doc.inactiveAt = new Date(doc.inactiveAt);
    Mongo.connect(_addActivePeriod, doc);

  }

};

module.exports = Mongo;

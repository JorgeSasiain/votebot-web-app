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

  connect: function() {
    if (Mongo.db) return;
    Mongo.db = MongoClient.connect(Mongo.MONGO_URI, function(err, db) {
      if (err) {
        console.error(err);
        throw err;
      }
      Mongo.db = db;
    });

  },

  close: function() {
    if (Mongo.db) {
      Mongo.db.close(function(err, result) {
        Mongo.db = null;
        if (err) console.error(err);
      });
    }
  },

  addPoll: function(doc) {
    doc.expireAt = new Date(doc.expireAt);
    Mongo.db.collection('polls').insert(doc, function (err, doc) {
      if (err) {
        console.error(err);
        throw err;
      }
    });
  },

  addActivePeriod: function(doc) {
    doc.inactiveAt = new Date(doc.inactiveAt);
    Mongo.db.collection('active_polls').insert(doc, function (err, doc) {
      if (err) {
        console.error(err);
        throw err;
      }
    });
  }

};

module.exports = Mongo;

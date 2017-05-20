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
        callback(null);
        return;
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
      if (doc == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }
      Mongo.db.collection('polls').insert(doc, function(err, result) {
        if (err || !result) res.sendStatus(422); /* Insert into DB failed */
        else res.sendStatus(201); /* Success */
      });
    };

    doc.expireAt = new Date(doc.expireAt);
    Mongo.connect(_addPoll, doc);

  },

  getPollsByCreator: function(creator, res) {

    let _getPollsByCreator = function(creator) {
      if (creator == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }
      Mongo.db.collection('polls').find({creator: creator}).toArray(function(err, result) {
        if (err || !result) res.sendStatus(422); /* Read from DB failed */
        else res.status(200).json(result); /* Success */
      });
    }

    Mongo.connect(_getPollsByCreator, creator);

  },

  deletePollByID: function(_id, res) {

    let _deletePollByID = function(_id) {
      if (_id == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }
      Mongo.db.collection('polls').deleteOne({_id: _id}, function(err, result) {
        if (err || !result) res.sendStatus(422); /* Delete from DB failed */
        else res.sendStatus(204); /* Success */
      })
    }

    Mongo.connect(_deletePollByID, _id);

  }

};

module.exports = Mongo;

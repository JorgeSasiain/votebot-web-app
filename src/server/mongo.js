import { MongoClient } from 'mongodb';
import { ObjectID } from 'mongodb';

var MONGO_URI = '';
try {
  MONGO_URI = require('./mongoUri').MONGO_URI;
} catch (ex) {
  MONGO_URI = process.env.MONGO_URI;
}

const Mongo = {

  MONGO_URI: MONGO_URI,

  /* Connection instance */
  db: null,

  /* Function to create a connection pool to the database and execute the passed callback */
  connect: function(callback, param) {

    if (Mongo.db) {
      callback(param);
      return;
    }

    MongoClient.connect(Mongo.MONGO_URI, function(err, db) {
      if (err) {
        callback(null);
        return;
      }
      Mongo.db = db;
      callback(param);
    });

  },

  /* Close the connection pool to the database */
  close: function() {
    if (Mongo.db) {
      Mongo.db.close(function(err, result) {
        Mongo.db = null;
      });
    }
  },

  /* On new poll created */
  addPoll: function(pollData, userOrMucData, res) {

    /* Create document with poll information in collection 'polls' */
    let _addPoll = function(data) {
      if (data == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }
      Mongo.db.collection('polls').insertOne(data[0], function(err, result) {
        if (err || !result) res.sendStatus(422); /* Insert into DB failed */
        else Mongo.updateUsersOrMucsCollection(data[1], res); /* Success */
      });
    };

    pollData.expireAt = new Date(pollData.expireAt);
    let data = [pollData, userOrMucData];

    Mongo.connect(_addPoll, data);

  },

  updateUsersOrMucsCollection: function(_data, res) {
    if (_data.users) Mongo.updateUsersCollection (_data, res);
    else if (_data.mucs) Mongo.updateMucsCollection (_data, res);
  },

  /* Update available polls of users with new poll */
  updateUsersCollection: function(_data, res) {

    let _updateUsersCollection = function(data) {
      Mongo.db.collection('users').updateOne(
        { user: data.user },
        { $push: {availablePolls: data.availablePolls} },
        { upsert: true },
      );
    };

    let updateUsersLoop = function() {
      data.user = _data.owner;
      data.availablePolls.owner = true;
      _updateUsersCollection(data);

      data.availablePolls.owner = false;
      for (let user of _data.users) {
        data.user = user;
        _updateUsersCollection(data);
      }
    }

    let data = {};
    data.availablePolls = {};
    data.availablePolls.poll_id = _data.poll_id;
    data.availablePolls.id_select = _data.id_select;
    updateUsersLoop();

    res.sendStatus(201);

  },

  /* Add new poll (vote) to MUC */
  updateMucsCollection: function(_data, res) {

    let _updateMucsCollection = function(data, muc) {
      Mongo.db.collection('mucs').count({muc: muc}, function(err, count) {
        if (err || count != 0) return; /* Don't insert if a vote is active in this MUC */
        data.muc = muc;
        data._id = new ObjectID();
        Mongo.db.collection('mucs').insertOne(data);
      });
    };

    let updateMucsLoop = function() {
      for (let muc of _data.mucs) {
        _updateMucsCollection(data, muc);
      }
    };

    let data = {};
    data.poll_id = _data.poll_id;
    data.expireAt = new Date(_data.expireAt);
    updateMucsLoop();

    res.sendStatus(201);

  },

  /* Get all polls created by a user */
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

  /* Delete poll with matching _id field */
  deletePollByID: function(_id, res) {

    let _deletePollByID = function(_id) {

      if (_id == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }

      Mongo.db.collection('polls').deleteOne({_id: _id}, function(err, result) {

        if (err || !result) res.sendStatus(422); /* Delete from DB failed */

        /* Also delete matching subdocuments in 'polls' or 'mucs' collection */
        else {
          res.sendStatus(204); /* Success */
          Mongo.db.collection('users').updateMany(
            { },
            { $pull: { availablePolls: { poll_id: _id } } }
          );
          Mongo.db.collection('mucs').deleteMany(
            { poll_id: _id }
          );
        }

      });

    }

    Mongo.connect(_deletePollByID, _id);

  },

  /* Update expireAt field of poll with matching _id field. Always called to terminate a poll */
  updatePollTTLByID: function(_id, date, res) {

    let _updatePollTTLByID = function(params) {
      if (params == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }

      Mongo.db.collection('polls').updateOne({_id: params._id}, {$set: {expireAt: params.date}},
      function(err, result) {

        if (err || !result) res.sendStatus(422); /* Delete from DB failed */

        /* Also delete matching subdocuments in 'polls' collection */
        else {
          res.sendStatus(204); /* Success */
          Mongo.db.collection('users').updateMany(
            { },
            { $pull: { availablePolls: { poll_id: _id } } }
          );
        }

      });

    }

    date = new Date(date);
    Mongo.connect(_updatePollTTLByID, {_id: _id, date: date});

  }

};

module.exports = Mongo;

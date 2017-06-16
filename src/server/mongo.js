import { MongoClient } from 'mongodb';

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
  updateUsersCollection: async function(_data, res) {

    // TODO
    // Once for each user, not just owner
    // If document for that user already exists, don't create another
    // Don't overwrite availablePolls, add another element to the array

    let _updateUsersCollection = function(data) {
      if (data == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }
      Mongo.db.collection('users').insertOne(data, function(err, result) {
        if (err || !result) res.sendStatus(422); /* Insert into DB failed */
        else res.sendStatus(201); /* Success */
      });
    };

    let data = {};
    data.user = _data.owner;
    data.availablePolls = {};
    data.availablePolls.poll_id = _data.poll_id;
    data.availablePolls.id_select = _data.id_select;
    data.availablePolls.owner = true;

    Mongo.connect(_updateUsersCollection, data);

  },

  /* Add new poll (vote) to MUC */
  updateMucsCollection: async function(_data, res) {

    let _updateMucsCollection = function(data) {
      if (data == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }
      Mongo.db.collection('mucs').findOneAndReplace(
        { muc: data.muc },
        data,
        { upsert: true },
        function(err, result) {
          if (err || !result) error = true;
      });
    };

    let updateMucsLoop = function() {
      for (let muc of _data.mucs) {
        data.muc = muc;
        Mongo.connect(_updateMucsCollection, data);
      }
    };

    let error = false;
    let data = {};
    data.poll_id = _data.poll_id;
    data.expireAt = new Date(_data.expireAt);

    await updateMucsLoop();

    if (error) res.sendStatus(422); /* Insert into DB failed */
    else res.sendStatus(201); /* Success */

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
        else res.sendStatus(204); /* Success */
      });
    }

    Mongo.connect(_deletePollByID, _id);

  },

  /* Update expireAt field of poll with matching _id field */
  updatePollTTLByID: function(_id, date, res) {

    let _updatePollTTLByID = function(params) {
      if (params == null) {
        res.sendStatus(500); /* Connection to DB failed */
        return;
      }
      Mongo.db.collection('polls').updateOne({_id: params._id}, {$set: {expireAt: params.date}},
      function(err, result) {
        if (err || !result) res.sendStatus(422); /* Delete from DB failed */
        else res.sendStatus(204); /* Success */
      });
    }

    date = new Date(date);
    Mongo.connect(_updatePollTTLByID, {_id: _id, date: date});

  }

};

module.exports = Mongo;

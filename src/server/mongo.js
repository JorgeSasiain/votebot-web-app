const MongoClient = require('mongodb').MongoClient;

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

    console.log(Mongo.MONGO_URI);
    Mongo.db = MongoClient.connect(Mongo.MONGO_URI, function(err, db) {
      if (err) {
        console.log(err);
        return;
      }
      Mongo.db = db;
    });

  },

  close: function() {
    if (Mongo.db) {
      Mongo.db.close(function(err, result) {
        Mongo.db = null;
      });
    }
  }

};

module.exports = Mongo;

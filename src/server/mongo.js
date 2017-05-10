const MongoClient = require('mongodb').MongoClient;

const Mongo = {

  MONGO_URI: process.env.MONGO_URI,

  db: {},

  connect: function() {
    Mongo.db = MongoClient.connect(Mongo.MONGO_URI, function(err, db) {
      if (err !== null) alert("err");
      if (db === null) alert("db-null");
      Mongo.db = db;
    });
  }

};

module.exports = Mongo;

var MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb://localhost:27017/mark_app', function (err, database) {
  if (err) throw err

  exports.get = database;
  
});

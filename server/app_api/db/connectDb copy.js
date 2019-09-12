// MUST EXCEPTION HANDLE FOR THIS FUNCTION
var dbURI = "mongodb://localhost:27017/bigchain";
if (process.env.NODE_ENV === 'production') {
  dbURI = 'enterProdURL';
}
var mongodb= require('mongodb');
var MongoClient= mongodb.MongoClient;
var URL = 'mongodb://127.0.0.1:27017/mainDB';

var db;
var error;
var waiting = []; // Callbacks waiting for the connection to be made

MongoClient.connect(dbURI,function(err,database){
  error = err;
  db = database;

  waiting.forEach(function(callback) {
    callback(err, database);
  });
});

module.exports = function(callback) {
  if (db || error) {
    callback(error, db);
  } else {
    waiting.push(callback);
  }
}
//const db = require('../db/connectDb');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };


module.exports.getAllAssets = function (req, res) {
  var db = req.db;
  console.log('db is active',db)
  db.collection('assets').find().toArray()
                .then(response => res.status(200).json(response))
                .catch(error => console.error(error));
};


module.exports.getDisease_ID_fromSummary = function(req, res) {
  var db = req.db;
  console.log('db is active',db)

  console.log("Finding data by ID:" + req.params._id);
   // var db = Connection;
    if (req.params && req.params._id) {
    db.collection('assets').find({ 'data.Disease_1': req.params._id }).toArray()
                .then(response => {
                  sendJSONresponse(res, 200, response)
                  console.log('response: ',response)
                })
                .catch(error => {
                  sendJSONresponse(res, 400, error)
                  console.error(error)
                });
      } else {
    console.log('No value entered',req.params._id)
    sendJSONresponse(res, 504, {
      "message": "Incorrect params given"
    });
  };
};



module.exports.getDisease_Summary = function(req, res) {
  var db = req.db;
  console.log('Making request for Disease Summary')

  db.collection('assets').aggregate([
    { $unwind : "$data"},
    {
      $match: {
          keywords: { $not: {$size: 0} }
      }
  },
    {$group : 
      {_id : "$data.Disease_1", 
      Disease_1 : {$sum: 1}
    }
  }]).toArray()
    .then(response => res.status(200).json(response))
    .catch(error => console.error(error));
  };



  module.exports.getName_ID = function (req, res) {
    var db = req.db;
    console.log('db is active',db)
  
    console.log("Finding data by ID: " + req.params._id);
     // var db = Connection;
      if (req.params && req.params._id) {
        database.collection('assets').find({},{"name" : req.params._id}).toArray()
                  .then(response => res.status(200).json(response))
                  .catch(error => console.error(error));
      } else {
      console.log('No value entered',req.params._id)
      sendJSONresponse(res, 400, {
        "message": "Incorrect params given"
      });
    };
  };



module.exports.getResponse_ID = function(req, res) {
  var db = req.db;
  console.log('db is active',db)

  console.log("Finding data by ID: " + req.params._id);
   // var db = Connection;
    if (req.params && req.params._id) {
      db.collection('assets').find({"Response 1" :{$regex: req.params._id, $options: 'i'}}).toArray()
        .then(response => res.status(200).json(response[1]))
        .catch(error => console.error(error));//,sendJSONresponse(res,404, {"message": "System error"}));
    } else {
    console.log('No value entered',req.params._id)
    sendJSONresponse(res, 400, {
      "message": "Incorrect params given"
    });
  }
};

module.exports.getResponse_Summary = function(req, res) {};


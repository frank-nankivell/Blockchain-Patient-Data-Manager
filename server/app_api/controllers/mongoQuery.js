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

module.exports.getDatabyID = function(req, res) {
  var db=req.db;
  var array =[
    {
        "transaction_id": "3c39dd41b9a0ad0c34fdfce683e452619b643069156fdb071336a4419f54c328",
        "output_index": 0
    },
    {
        "transaction_id": "7c66de7d426f342fce2cdb62807aa2c04f67164accacc4c1273748b2cf16aff9",
        "output_index": 0
    },
    {
        "transaction_id": "bc0157684d5cbbbdb2351863df125b6f49fbf2b7535dc693cff9eb03d25aceb5",
        "output_index": 0
    },
    {
        "transaction_id": "3c3314e0e92d64d1d78256761adc4cf9f653e3197f21095240ed72c0e6809c33",
        "output_index": 0
    },
    {
        "transaction_id": "f94d85d03af7a41ffc499cfe40ca9ae1617e3445da4f423ac244c78404ac80ca",
        "output_index": 0
    },
    {
        "transaction_id": "ffe19c00cb8749c5b2a902a4b4536959504af60f891273771b65a1b44364a305",
        "output_index": 0
    },
    {
        "transaction_id": "f676f49da03e92597e023701d3b9a49f0dea66c5e1f1cd34c9fb54b64106a6df",
        "output_index": 0
    }
]

db.collection('assets').find({ "id": array[0].transaction_id})
      .toArray()
      .then(response => sendJSONresponse(res, 200, response))
      .catch(error => {
        console.log(error)
        sendJSONresponse(res, 504, error)
      });
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
    .catch(error => {
      console.error(error)
      sendJSONresponse(res, 504, error)
    });
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


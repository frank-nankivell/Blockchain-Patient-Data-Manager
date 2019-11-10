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

//var val =[{"transaction_id":"2cc05d94846f8a128bca4c3f5d9a48e748f35b243da008b5c8ad42972ca4e61a","output_index":0},{"transaction_id":"288df6839de48c113b99a00bf37c1545a980b6cb1945890d76f36f252b667d41","output_index":0},{"transaction_id":"aa69de55c8f37a2539b27d8c6d91c4d6b509f5a0f630ba8bc5e3f152bba26aa0","output_index":0},{"transaction_id":"1eb5766555f7a32907aa2b8edb0d49d81f3bbdacf0c47bf769238fd044d8a08f","output_index":0},{"transaction_id":"d1175c4def8aede6c5c0bf5806739b6392637d95a83053b1a9fdbb9d9154c9b4","output_index":0}]
var val= req.body.array;
console.log("val: ",val)
var db=req.db;
let txArr = [];
var assetMerge;

for(let txIds in val) {
  txArr.push(Object.values(val[txIds])); 
};
let txMerge = [].concat.apply([], txArr);
console.log("txMerge: ",txMerge)

console.log('newArr', txMerge)

var db=req.db
      db.collection('transactions').find({"id": { $in: txMerge}})
      .toArray()
      .then(response => {
        let idArr = []
        for(let i=0; i<response.length; i++) {  
        idArr.push(response[i].asset.id);

        };
        assetMerge = [].concat.apply([],idArr);
        console.log("getassetIds: ", assetMerge);

      })
      .then(() => {
        db.collection('assets').find({"id": { $in: assetMerge}})
        .toArray()
        .then(assets => {
          console.log('list of assets: ',assets)
          sendJSONresponse(res, 200, assets)
      })
      .catch(error => {
        console.log(error)
        sendJSONresponse(res, 504, error)
      });
    })
  };


module.exports.getAssets = function(req, res) {

  var val= req.body.array;
  var db=req.db;
  let newArr = [];
  
  for(let ids in val) {
    newArr.push(Object.values(val[ids])); 
  };
  var merged = [].concat.apply([], newArr);
  
  console.log('newArr', merged)
  
  var db=req.db
  db.collection('transactions').find({"id": { $in: merged}})
        .toArray()
        .then(response => {
          // -> make a request to get assets from id's 
          sendJSONresponse(res, 200, response)
          console.log('getDatabyId: ',response)
        })
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


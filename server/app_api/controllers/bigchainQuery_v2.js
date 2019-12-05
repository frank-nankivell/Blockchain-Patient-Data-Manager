const driver = require('bigchaindb-driver')
const csv = require('csv-parser')
const path = require('path')

'use strict'
const fs = require('fs')

var JsonError  = {
  "error": "Bigchain Query Error"
}

var PayError = {
  "error" : "Incorrect Payload"
}

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };


const API_PATH = "http://127.0.0.1:9984/api/v1/";
if (process.env.NODE_ENV === 'production') {
    API_PATH = 'enterProdURL';
}
const conn = new driver.Connection(API_PATH)

// creat user key
module.exports.createUserKey = function (req, res) {
    let name = new driver.Ed25519Keypair()
    let key = name.publicKey;
    console.log('test key: ',key, 'for user: ', name) 

    if(key!=null || key!=undefined ) {
    sendJSONresponse(res, 200, key)
    console.log("Key Created",key)
    } else {
      console.log('error')
    sendJSONresponse(res, 400, JsonError)
    };
};

module.exports.makeTransfer = function(req, res) {

  getAssetObject(req, res, function(req, res, output) {

    getKeyfromList(req, res, output, function(req, res, data) {

       transferloop(req, res, data, function(req, res, details) { 

        console.log('bigBackCall', details)
        sendJSONresponse(res, 200, details)
        });

      });
      // 
  });
};



// now gets an array of values, but not those specific ot the asset type
const getAssetObject= function(req, res, callback) {
  var db = req.db

  console.log('Search Assets: ',req.body.asset_Type)
  if (req.body.asset_Type!=null || req.body.asset_Type!=undefined) {

  db.collection('assets').find({ 'data.Disease_1': req.body.asset_Type }).toArray()
                .then(assets => {
              let array = assets.map(x => x.id);
              console.log("GetassetsCheck: ",array)
              callback(req, res, array)
      
      }).catch(error => {
        console.log('Error:'+error)
        // will send error if function has problem i.e network etc
        // but also  if the user enters a bad value...
        sendJSONresponse(res, 504, JsonError)
      })
  } else {

  sendJSONresponse(res,400, PayError)
  };
};



function getData(input, arr) {
  // need error checking in here
    var i = arr.length;
    let ownerKeySet
    let finalArr =[];
    while(i--) {
    if(input == arr[i].prepared_create_tx) {
      ownerKeySet = arr[i];
      finalArr.push(ownerKeySet)
        break;   
    };
  };
  return finalArr;
};


const getKeyfromList = function(req, res, output, callback) {
  
  const arr = [];
  const finalArr = [];
  const SendArr = [];

  // output is array of ids
  if (output !=undefined) {


  var inputFilePath = 'output.csv'
  fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', function(data){
      try {
        arr.push(data)
      }
      catch(err) {
       console.log(err)
      }
  })
  .on('end',function()
  {
    for (let b = 0; b < output.length; b++) {
    console.log('getting private key for, ',output[b]);
    var keysAndVals = getData(output[b],arr)
    finalArr.push(keysAndVals)
  };
  console.log('KeySetCheck: ',finalArr)
    callback(req, res, finalArr)
  });
} else {
  console.log("output is undefined")
  sendJSONresponse(res, 400,PayError )
  return;
  }
};

var transferloopArray = [];

const transferloop = async (req, res, data, callback) => {

   transferloopArray = [];

   data.forEach(element => {
    console.log('Iteration per round_',element)
     transferAssetFunction(req, res, element[0].private_key, req.body.pubkey, element[0].prepared_create_tx, req.body.summary, req.body.researchStatus, 
      function(req, res, callback) {
          console.log('timoutResponse', callback)
      });
  });


  checkData = function() {
  if(transferloopArray.length != data.length) {
    setTimeout(() => checkData(), 300);
    console.log('123')
  }
  else {
    console.log('456')
    callback(req,res,transferloopArray)
  }
}

checkData();
};

 
const transferAssetFunction = async(req, res, _privatekey, _userPubKey, _prepared_create_tx, _summary, _researchstatus, _callback) =>{

    var summary = _summary;
    var researchStatus = _researchstatus;
    var name_key = _userPubKey;
    var privateKey = _privatekey;
    var id = _prepared_create_tx;

    const conn = new driver.Connection(API_PATH)

 try {
        // find original transaction via the transaction ID
        conn.getTransaction(id)
        .then((result) => {
          console.log('getTransaction as callback: ', result)
          const newTransfer = driver.Transaction
            .makeTransferTransaction(
          [{ 
            tx: result, 
            output_index: 0
          }],
        // outputs
        [driver.Transaction.makeOutput(
          driver.Transaction
          .makeEd25519Condition(name_key))],
          // metadata
          {
          time: '30 days',
          research_project: researchStatus,
          lay_summary: summary 
          }

        )
        let txtransfer = driver.Transaction
          .signTransaction(newTransfer, privateKey)
                console.log('Posting signed transaction: ', txtransfer)

                // Post with commit so transaction is validated and included in a block
                return conn.postTransaction(txtransfer)
        })
        .then(tx => {
          console.log('Transfer Succesfull: ', tx.id)
          transferloopArray.push(tx)
          callback(req, res, tx)
        })
        .catch(error => {
          console.log('Error in Transacaction',error)
          transferloopArray.push(error)
          callback(req, res, error)
          //sendJSONresponse(req, 400, error)
        })
    } 
    catch {
      sendJSONresponse(req, 400, PayError)
      return;
    }
  };


  // function that gets assets with IDs
  // from the selected dataset user wants to use
  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
 

  module.exports.searchbyID= function(req, res, callback) {

    console.log('Search Assets: ',req.body.asset_ID)

    if (req.body.asset_ID!=null || req.body.asset_ID!=undefined) {

    conn.searchAssets(req.body.asset_ID)
        .then(assets => {
          console.log("_searchbyID: ",assets)
        sendJSONresponse(req, res, assets)
        }).catch(error => {
          console.log('Error:'+error)
          // will send error if function has problem i.e network etc
          // but also  if the user enters a bad value...
          sendJSONresponse(res, 504, JsonError)
        })
    } else {

    sendJSONresponse(res,400, PayError)
    };
  };

  module.exports.getdata = function(req, res) {

      console.log('SearchDataBack: ',req.body.asset_Type)
  
      if (req.body.asset_Type!=null || req.body.asset_Type!=undefined) {
  
      conn.searchAssets(req.body.asset_Type)
          .then(assets => {
          console.log("getdata: ",assets)
          sendJSONresponse(res, 200, assets)
          
          }).catch(error => {
            console.log('Error:'+ error)
            sendJSONresponse(res, 504, JsonError)
          })
        } else {

      sendJSONresponse(res,400, PayError)
      };
  };


  module.exports.getOwner = function(req, res) {
    var outcome = false;
    if (req.body.tx!=null || req.body.pubkey!=undefined) {

    conn.getTransaction(req.body.tx)

    .then((result) => {
      if(result['outputs'][0]['public_keys'][0] == req.body.pubkey) {
        outcome=true;
      }
      console.log('Is the owner of this tx: .',req.body.tx, 'this key?', req.body.pubkey,' : ', outcome)
      sendJSONresponse(res,200, outcome)
    }).catch(error => {
          console.log('Error:'+error)
          // will send error if function has problem i.e network etc
          // but also  if the user enters a bad value...
          
          sendJSONresponse(res, 504, JsonError)
        })
    } else {

    sendJSONresponse(res,400, PayError)
    };
};

module.exports.checkOwnedData = function(req, res) {

  if (req.body.pubkey!=undefined) {

conn.listOutputs(req.body.pubkey, false)
  .then(listUnspentOutputs => {
          console.log("Unspent outputs for User: ", listUnspentOutputs.length)
          console.log("Details ", listUnspentOutputs)
  sendJSONresponse(res,200,listUnspentOutputs)
  })
  .catch(error => {
    console.log(error)
    sendJSONresponse(res, 400, error)
  })
} else {
  sendJSONresponse(res,400, PayError)
  };

};


module.exports.checkPreviousAsset = function(req, res) {

  if (req.body.pubkey!=undefined) {

  conn.listOutputs(req.body.pubkey, true)
  .then(listSpentOutputs => {
                console.log("\nSpent outputs for User: ", listSpentOutputs.length)
                console.log("\nDetails ", listSpentOutputs)
                sendJSONresponse(res,200,listSpentOutputs)
    })
  .catch(error => {
    console.log(error)
    sendJSONresponse(res, 400, error)
  })
} else {

  sendJSONresponse(res,400, PayError)
  };

};



  // function to transfer list of assets 
  module.exports.transferAssetList = function(req, res) {};


  // return all data 
  module.exports.getOwnedAssets = function(req, res) {};
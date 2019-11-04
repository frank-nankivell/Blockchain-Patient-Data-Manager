const driver = require('bigchaindb-driver')
const csv = require('csv-parser')
const path = require('path')

'use strict'
const fs = require('fs')



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
    var name = req.name;
    console.log('making key for', name)
    name = new driver.Ed25519Keypair()
    var key = name.publicKey;

    console.log('test key: ',key, 'for user: ', name) 
    
    if(key!=null || key!=undefined ) {
      
    sendJSONresponse(res, 200, key)

    }
    else {
        console.log('error')
        sendJSONresponse(res, 404, 'error with key creation')
    };
  };

// test function from documentation
module.exports.testTransfer = function (req, res) {

const alice = new driver.Ed25519Keypair()
const bob = new driver.Ed25519Keypair()

console.log('Alice: ', alice.publicKey)
console.log('Bob: ', bob.publicKey)

// Define the asset to store, in this example
// we store a bicycle with its serial number and manufacturer
const assetdata = {
        'bicycle': {
                'serial_number': '123',
                'manufacturer': 'Bicycle Inc.',
        }
}

// Metadata contains information about the transaction itself
// (can be `null` if not needed)
// E.g. the bicycle is fabricated on earth
const metadata = {'planet': 'earth'}

// Construct a transaction payload
const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
)

// Sign the transaction with private keys of Alice to fulfill it
const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)

console.log('Transaction direct no callbacK:',txCreateAliceSimpleSigned)

// Send the transaction off to BigchainDB
const conn = new driver.Connection(API_PATH,
  {
      app_id: 'valid_id',
      app_key: 'valid_key'
  }
)


conn.postTransactionCommit(txCreateAliceSimpleSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
        // With the postTransactionCommit if the response is correct, then the transaction
        // is valid and commited to a block

        // Transfer bicycle to Bob
        .then(() => {
                console.log('CHECK KEY:',txCreateAliceSimpleSigned.id)
                conn.getTransaction(txCreateAliceSimpleSigned.id)
                .then((result) => {
                  console.log('getTransaction as callback: ', result)
                  var outcome = result;


                const txTransferBob = driver.Transaction.makeTransferTransaction(
                        // signedTx to transfer and output index
                        [{ tx: outcome, output_index: 0 }],
                        [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(bob.publicKey))],
                        // metadata
                        {price: '100 euro'}
                )

                // Sign with alice's private key
                let txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, alice.privateKey)
                console.log('Posting signed transaction: ', txTransferBobSigned)
                

                // Post with commit so transaction is validated and included in a block
                return conn.postTransaction(txTransferBobSigned)
        })
        .then(tx => {
                res.status(200).json(tx)
                console.log('Response from BDB server:', tx)
                console.log('Is Bob the owner?', tx['outputs'][0]['public_keys'][0] == bob.publicKey)
                console.log('Was Alice the previous owner?', tx['inputs'][0]['owners_before'][0] == alice.publicKey )
        })
        // Search for asset based on the serial number of the bicycle
        .then(() => conn.searchAssets('Bicycle Inc.'))
        .then(assets => console.log('Found assets with serial number Bicycle Inc.:', asset))
    })
    .catch(error => console.log('error',error))
  };



/// Test directly typed code
  module.exports.transferAsset = function(req, res) {};
  /*
  const transferAssets_1 = function(req, res, data, pubkey, callback) {

    console.log(JSON.stringify(data))
    console.log(JSON.stringify(pubkey))


    var privateKey = data[0].private_key;
    var id = data[0].prepared_create_tx;
    let key = req.body.pubkey;

    console.log('keycheck: --',key)

    console.log('key :',privateKey)
    console.log('id :',id)

    var it = 5

    callback(req,res,it)

  };
  */
    
const transferAssetFunction = function(req, res, data, callback) {

    var name_key = req.body.pubkey;
    var privateKey = data[0].private_key;
    var id = data[0].prepared_create_tx;

    const conn = new driver.Connection(API_PATH)

    // need to check that name_key is 32 chars long
    // need to check that privateKey is 32 chars long

        if (name_key!=undefined && privateKey!=undefined && id!=undefined) {
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
          research_project: 'analysis',
          lay_summary:'analysis on xyz'
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
          callback(tx)
        })
        .catch(error => {
          console.log('error',error)
          sendJSONresponse(req, 400, error)
        })
    } 
    else {
      var error = "error"
      sendJSONresponse(req, 400,error)
    }
  };

  // function that gets assets with IDs
  // from the selected dataset user wants to use
  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  const getAssetObject= function(req, res, callback) {

    console.log('Search Assets: ',req.body.asset_Type)

    if (req.body.asset_Type!=null || req.body.asset_Type!=undefined) {

    conn.searchAssets(req.body.asset_Type)
        .then(assets => {
          console.log("GetassetsCheck: ",assets)

        // TO DO loop through obj and create array with ID
        // currently only one ID

        callback(req, res, assets[0].id)
        
        }).catch(error => {
          console.log('Error:'+error)
          // will send error if function has problem i.e network etc
          // but also  if the user enters a bad value...
          sendJSONresponse(res, 504, "Error: Bigchain Query Error")
        })
    } else {

    sendJSONresponse(res,400, "Error: Incorrect Payload")
    };
  };


  // function to get Key from List loaded in CSV
  // if the system was built out in a broader fashion 
  // then this function would request data from a user 
  // not automatically provide a list of keys
  const getKeyfromList = function(req, res, output, callback) {

    const arr = [];
    const finalArr = [];

    var inputFilePath = './server/app_api/controllers/output_v1.csv'
    fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', function(data){
        try {
          arr.push(data)
          //console.log(arr)    
        }
        catch(err) {
         console.log(err)
            //error handler
        }
    })
    .on('end',function()
    {
    // will only work for one record
    // need to loop through it for more records 
      var i = arr.length;
      var ownerKeySet;
      while(i--) {
      if(output == arr[i].prepared_create_tx) {
        ownerKeySet = arr[i];
        finalArr.push(ownerKeySet)
          break;   
      };
      
    };
    console.log('KeySetCheck: ',finalArr)
    callback(req, res, finalArr)
  });
  


};

  // data is object of data, including ids - yes
  // need to then select each ID of object
  // then make a request (somewhere - to a JSON paylaod or ganache ideally?!) to get patient keys
  // create new object which has [{ id: xxx, patientPrivateKey: xx }, { id: xxx, patientPrivateKey: xx },]
  // send object to transfer asset List

  module.exports.makeTransfer = function(req, res) {

    console.log(JSON.stringify('reqchecl',));

    getAssetObject(req, res, function(req, res, output) {

      getKeyfromList(req,res, output, function(req, res, data) {

        transferAssetFunction(req, res, data, function(req, res, callback) {
        
          sendJSONresponse(res, 200, callback)

        });
        // 
      });

    });

  };
  
  module.exports.checkUser = function(req, res) {
    // function checks who owns dataset

    let tx = req.body.tx;
    let key = req.body.tx;

    conn.getTransaction(tx.id)
                .then((result) => {

                });


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
            sendJSONresponse(res, 504, "Error: Bigchain Query Error")
          })
        } else {

      sendJSONresponse(res,400, "Error: Incorrect Payload")
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
          sendJSONresponse(res, 504, "Error: Bigchain Query Error")
        })
    } else {

    sendJSONresponse(res,400, "Error: Incorrect Payload")
    };
};



  // function to transfer list of assets 
  module.exports.transferAssetList = function(req, res) {};


  // return all data 
  module.exports.getOwnedAssets = function(req, res) {};
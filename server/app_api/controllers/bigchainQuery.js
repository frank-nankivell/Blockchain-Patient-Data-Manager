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

    var output = 'Public Key is:'+ key

    res.status(200).json(output)
    }
    else {
        console.log('error')
        res.status(200).json('error with key creation');
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
  module.exports.transferAsset = function(req, res) {

    // needs three paramaters {transferID, privateKeyOfOwner, newPublicKey}

    // patient 54
    var privateKey = 'G8Cv6kEZjnwZLDyUXmFRzhu6PBJY4PMCpWFtRDRB4nYt';
    // CREATE transaction id
    // written as variable directly whilst testing
    var id = '95d0693c5c880f7b0c5b267c033c429ad6c4d7ad2c08870dccd8d76d68787ccc';

    const conn = new driver.Connection(API_PATH)
    // create new owner for the asset
    var name = new driver.Ed25519Keypair()

    console.log('New persons public key', name.publicKey)

        if (name!=undefined) {
        // find original transaction via the transaction ID
        conn.getTransaction(id)
        .then((result) => {
          console.log('getTransaction as callback: ', result)
          var outcome = result;
          const newTransfer = driver.Transaction
            .makeTransferTransaction(
          [{ 
            tx: result, 
            output_index: 0
          }],
        // outputs
        [driver.Transaction.makeOutput(
          driver.Transaction
          .makeEd25519Condition(name.publicKey))],
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
        .then(callback => {
          console.log('Transfer Succesfull', callback.id)
          res.status(200).json('Transfer Succesfull. New transfer ID'+ callback.id)
        })
        .catch(error => {
          console.log('error',error)
          res.status(400).json(error)
        })
    } 
    else {
      var error = "error"
      res.status(400).json(error)
    }
  };

  // function that gets assets with IDs
  // from the selected dataset user wants to use
  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  const getAssetObject= function(req, res, callback) {
    console.log('Search Assets',req.params.asset)
    if (req.params.asset!=null) {
    conn.searchAssets(req.params.asset)
        .then(assets => {
        //  console.log('Found asset:'+JSON.stringify(assets))
          callback(req, res, assets)
        }).catch(error => {
          console.log('Error:'+error)
          sendJSONresponse(res, 504, "Error: Bigchain Query Error")
        })
    } else {
    sendJSONresponse(res,400, "Error: Incorrect Payload")
    };
  };


  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  // - - - - - - - - - - - - - - - - - - - - - - -
  module.exports.searchAsset = function(req, res) {

    getAssetObject(req, res, function(req, res, output) {
    const vals = output; // only one value right now - need to make it a loop of objects
    const arr = [];
    console.log(output[0].data.id,'id')

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
      console.log(output[0].data.id,'id-vals')
      console.log(vals)
      console.log(arr[0].prepared_create_tx,'prep tx arr0')
      var i = arr.length;
      var ownerData;
      while(i--) {
      if(vals.id == arr[i].prepared_create_tx) {
          ownerData = users[i];
          break;
          
      };
      
    };
    console.log('test',ownerData)
    sendJSONresponse(res, 200, ownerData)
  });
  
});
 }

      // data is object of data, including ids 

      // need to then select each ID of object
      // then make a request (somewhere - to a JSON paylaod or ganache ideally?!) to get patient keys
      // create new object which has [{ id: xxx, patientPrivateKey: xx }, { id: xxx, patientPrivateKey: xx },]
      // send object to transfer asset List
  


  // function to transfer list of assets 
  module.exports.transferAssetList = function(req, res) {

  };

  // return all data 
  module.exports.getOwnedAssets = function(req, res) {};


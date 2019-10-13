const driver = require('bigchaindb-driver')

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };


const API_PATH = "http://127.0.0.1:9984/api/v1/";
if (process.env.NODE_ENV === 'production') {
    API_PATH = 'enterProdURL';
}
const conn = new driver.Connection(API_PATH)

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
                res.status(200).json(txTransferBobSigned)

                // Post with commit so transaction is validated and included in a block
                return conn.postTransaction(txTransferBobSigned)
        })
        .then(tx => {
               // res.status(200).json(tx)
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



/// Actual code but not functioning 
  module.exports.transferAsset = function(req, res) {

        // patientID_79 08102019
    // written as variable directly whilst testing
    var privateKey = 'AE1hUbzmmDe6CPsMNVM48KSrSqcFAjUF9gbDDYbhVVwJ';
    // CREATE transaction id
    // written as variable directly whilst testing
    var id = '44f30e4feb82f53ae1407aed61d43a82c3db2891fa039019d926dfeb340c1714';

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
        const txtransfer = driver.Transaction
          .signTransaction(newTransfer, name.privateKey)
                console.log('Posting signed transaction: ', txtransfer)

                // Post with commit so transaction is validated and included in a block
                return conn.postTransactionCommit(txtransfer)
        })
        .then(res => {
          console.log('Transfer Succesful', res.id)
          res.status(200).json(res.id)
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





/*
const signedTransfer = BigchainDB.Transaction.signTransaction(createTranfer,
    keypair.privateKey)

  /*
  key: 'makeTransferTransaction',
  value: function makeTransferTransaction(unspentOutputs, outputs, metadata) {
      var inputs = unspentOutputs.map((unspentOutput) => {
          var _tx$outputIndex = { tx: unspentOutput.tx, outputIndex: unspentOutput.output_index },
              tx = _tx$outputIndex.tx,
              outputIndex = _tx$outputIndex.outputIndex;

          var fulfilledOutput = tx.outputs[outputIndex];
          var transactionLink = {
              'output_index': outputIndex,
              'transaction_id': tx.id
          };

          return Transaction.makeInputTemplate(fulfilledOutput.public_keys, transactionLink);
      });

      var assetLink = {
          'id': unspentOutputs[0].tx.operation === 'CREATE' ? unspentOutputs[0].tx.id : unspentOutputs[0].tx.asset.id
      };
      return Transaction.makeTransaction('TRANSFER', assetLink, metadata, outputs, inputs);
  }

  */
  

/* 

 .then(() => {
                const txTransferBob = driver.Transaction.makeTransferTransaction(
                        // signedTx to transfer and output index
                        [{ tx: txCreateAliceSimpleSigned, output_index: 0 }],
                        [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(bob.publicKey))],
                        // metadata
                        {price: '100 euro'}
                )

                // Sign with alice's private key
                let txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, alice.privateKey)
                console.log('Posting signed transaction: ', txTransferBobSigned)

                // Post with commit so transaction is validated and included in a block
                return conn.postTransactionCommit(txTransferBobSigned)
        })


      .then(transaction => {

      // create new transfer transaction
      const newTransfer = driver.Transaction.makeTransferTransaction(
        // signedTx to transfer and output index
        [{ tx: transaction, output_index: 0 }],

        [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(name.publicKey))],

        // metadata
        {
        time: '30 days',
        research_project: 'analysis',
        lay_summary:'analysis on xyz'
        }
        )
    .then(newTransfer => {
    // sign and send the transaction
    let txTransferNewsigned = driver.Transaction.signTransaction(newTransfer, privateKey);
    conn.postTransactionCommit(txTransferNewsigned)
    console.log('Posting signed transaction: ', txTransferNewsigned)
    conn.postTransactionCommit(txTransferNewsigned)
    
  })
  ).then()


  res.status(200).json(txTransferNewsigned)

*/
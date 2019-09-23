const driver = require('bigchaindb-driver')

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };


const API_PATH = "http://localhost:9984/api/v1/";
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





  module.exports.transferAsset = function(req, res) {


    const conn = new driver.Connection(API_PATH)
    // tina russo's private key
    var privateKey = '5Gbnyyu6XXMJ9RkonrCGaoL4dqT21T4rNR46ADgCc8Kk';
    // transaction Id from tina russo ID for now
    var id = '9fa24c8efce74fc83d187b4894c3a5f12c8ee049d03dc27f1124b5c3b2dbe9da';

    // create new owner for the asset
    var name = new driver.Ed25519Keypair()

    if(name.publicKey != null || name.undefined != undefined)
    {
        console.log('New persons public key', name.publicKey)
        // find original transaction via the transaction ID
        let transaction = conn.getTransaction(id)
        //console.log('transaction ID', transaction)
        if (transaction == null ||transaction == undefined) {
          var error = 'error';
          res.status(400).json(error)
          return;
        } 
        else
        {
          console.log(transaction, 'transaction') 
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

          ).then(() => {
            res.status(200).json(newTransfer)
            console.log(newTransfer)
          });
        };

      };
      var error2 = 'error';
      res.status(400).json(error2)
      return;
  };
  

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
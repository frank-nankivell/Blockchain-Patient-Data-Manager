
module.exports = {

  // Configure your networks
   networks: {
 
    // development network is default for truffle
     development: {
      host: "localhost",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",
      accounts: 5,
      defaultEtherBalance: 500,
      blockTime: 3       // Any network (default: none)
     }
   },
 
   // Configure your compilers
   compilers: {
     solc: {
       version: "0.4.18",    // Fetch exact version from solc-bin (default: truffle's version)
     }
   }
 }

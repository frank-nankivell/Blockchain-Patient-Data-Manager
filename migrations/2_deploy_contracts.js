var DataAccess = artifacts.require("./DataAccess.sol");
var Register = artifacts.require("./Register.sol");

module.exports = function(deployer) {
  deployer.deploy(DataAccess);
};

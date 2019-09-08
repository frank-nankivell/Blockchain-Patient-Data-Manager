var DataAccess = artifacts.require("./DataAccess.sol");

module.exports = function(deployer) {
  deployer.deploy(DataAccess);
};

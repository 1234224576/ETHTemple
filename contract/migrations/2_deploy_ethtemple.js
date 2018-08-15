var ETHTemple = artifacts.require("./ETHTemple.sol");

module.exports = function(deployer) {
    deployer.deploy(ETHTemple);
}
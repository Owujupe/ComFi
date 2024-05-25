var osusuContract = artifacts.require("Osusu");

module.exports = async function (deployer) {
  // deployment steps
  await deployer.deploy(osusuContract);
  //access information about your deployed contract instance
  const instance = await osusuContract.deployed();
};

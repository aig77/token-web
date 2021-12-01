const Migrations = artifacts.require("MyToken");

const name = "MyToken";
const symbol = "NFT";
const baseURI = "https://ipfs.io/ipfs/";
const unrevealedURI = "QmaxbZevrA59VHVQxxzYDZ3mfBBD5HXBdQD2UmuUPqabhb";

module.exports = function (deployer) {
  deployer.deploy(Migrations, name, symbol, baseURI, unrevealedURI);
};
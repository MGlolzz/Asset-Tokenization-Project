var chai = require("chai");

var chaiAsPromised = require("chai-as-promised");


const BN = web3.utils.BN;
var chaiBN = require("chai-bn")(BN);

chai.use(chaiBN);
chai.use(chaiAsPromised);

module.exports = chai;
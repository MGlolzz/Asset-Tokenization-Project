var MyToken = artifacts.require("MyToken.sol");
var MyTokenSale = artifacts.require("MyTokenSale");
var MyKyc  = artifacts.require("KycContract");

//mint token without initial supply, mint on demand
var MyERC20MintableToken = artifacts.require("ERC20Mintable.sol");
var MyMintedCrowdsale = artifacts.require("MintedCrowdsale.sol");
require("dotenv").config({path:"../.env"})
module.exports = async function(deployer){
    let address = await web3.eth.getAccounts();
    await deployer.deploy(MyToken,process.env.INITIAL_TOKENS);
    console.log("address[0]",address[0]);
    await deployer.deploy(MyKyc,address[0])
    await deployer.deploy(MyTokenSale,1,address[0],MyToken.address,MyKyc.address);
    // await deployer.deploy(MyMintedCrowdsale,1,address[0],MyToken.address,MyKyc.address)
    let instance = await MyToken.deployed();
    await instance.AddMinter(MyTokenSale.address);
    await instance.transfer(MyTokenSale.address,process.env.INITIAL_TOKENS);
}
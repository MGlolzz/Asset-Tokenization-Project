const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract =artifacts.require("KycContract");
const chai = require("./setupChai.js");

const expect = chai.expect;
const BN = web3.utils.BN;

// await expect(tokenSaleInstance.sendTransaction(...)).to.be.fulfilled;: 
// This syntax works because tokenSaleInstance.sendTransaction(...) 
// returns a promise, and await is used to wait for the promise to resolve 
// before performing the assertion.

// expect(await instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(totalSupply);: 
// Here, instance.balanceOf(deployerAccount) is a synchronous function call, 
// and expect immediately evaluates the assertion after await resolves 
// the promise returned by balanceOf. Therefore, expect is used before await.

contract("MyTokenSale test",async function(accounts){
    const [deployerAccount, recipient,anotherAccount] = accounts;
    it("should not have balance in deployer account",async ()=>{
        let instance = await Token.deployed();

        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("should have all tokens in the TokenSale contract",async()=>{
    
        let token_instance = await Token.deployed();
        let totalSupply = await token_instance.totalSupply();
        expect(token_instance.balanceOf(TokenSale.address)).to.eventually.be.a.bignumber.equal(totalSupply);

    })

    it("should be possible to buy token",async ()=>{
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance =await TokenSale.deployed();
        let kycContractInstance = await KycContract.deployed();
        let balanaceOfFirstUser = await tokenInstance.balanceOf(deployerAccount);
        await kycContractInstance.setKycCompleted(deployerAccount,{from:deployerAccount});
        // console.log(await tokenSaleInstance.sendTransaction({from:deployerAccount,value:web3.utils.toWei("1","wei")}))
        //sned money to to tokensale contract to buy token
        await expect(tokenSaleInstance.sendTransaction({from:deployerAccount,value:web3.utils.toWei("1","wei")})).to.eventually.be.fulfilled;
        // console.log(await tokenSaleInstance.sendTransaction({from:deployerAccount,value:web3.utils.toWei("1","wei")}));
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanaceOfFirstUser +new BN(1));
    })
})


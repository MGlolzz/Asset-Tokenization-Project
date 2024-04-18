const Token = artifacts.require("MyToken");

const chai = require("./setupChai.js");

const expect = chai.expect;
const BN = web3.utils.BN;
contract("MyToken test",async function(accounts){
    const [deployerAccount, recipient,anotherAccount] = accounts;

    beforeEach(async ()=>{
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })
    it("should have all tokens in my account", async () =>{
        // let instance = await Token.deployed();//attached to the migration file, not good
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        let balance = await instance.balanceOf(accounts[0]);

        //usual aproach
        //assert.equal(balance.valueOf(),ini)
        
        
        //better
        expect(await instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(totalSupply);

        //best with chai-as-promised
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    
    })

    it("should send tokens to recipient",async ()=>{
        const sendToken = 1;
        // let instance  = await Token.deployed();
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();

        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect( instance.transfer(recipient,sendToken)).to.be.fulfilled;
        // console.log(await instance.transfer(recipient,sendToken))
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken)));
        
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendToken));
    })

    it ("should not send more tokens than available",async ()=>{
        // let instance  =await Token.deployed();
        let instance = this.myToken;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(recipient,new BN(balanceOfDeployer+1))).to.eventually.be.rejected;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equals(balanceOfDeployer);

    })
});

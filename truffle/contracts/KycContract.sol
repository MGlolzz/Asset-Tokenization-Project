// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

 contract KycContract is Ownable{
    mapping(address=>bool) allowed;
    constructor(address initialOwner) Ownable(initialOwner) {
        // Additional constructor logic for KycContract
    }
    function setKycCompleted(address addr) public onlyOwner {
        allowed[addr] = true;
    }

    function setKycRevoked(address addr) public onlyOwner{
        allowed[addr] = false;
    }

    function kycCompleted(address addr) public view returns(bool){
        return allowed[addr];
    }
}
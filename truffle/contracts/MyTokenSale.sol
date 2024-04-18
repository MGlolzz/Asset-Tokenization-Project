// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MintedCrowdsale.sol";  
import "./KycContract.sol";

contract MyTokenSale is MintedCrowdsale {
    KycContract kyc;
    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    ) MintedCrowdsale() Crowdsale(rate, wallet, token) {

        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary,uint256 weiAmount) internal view override{
        super._preValidatePurchase(beneficiary,weiAmount);
        require(kyc.kycCompleted(msg.sender),"KYC not completed, purchase not allowed");
    }
}

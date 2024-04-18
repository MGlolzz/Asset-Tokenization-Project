// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20Mintable.sol";
contract MyToken is ERC20Mintable {

    constructor(uint256 amount) ERC20Mintable("Starbuck", "STAR") {
        mint(msg.sender, amount * (10 ** uint256(decimals())));

    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MinterRole.sol";

contract ERC20Mintable is ERC20, MinterRole {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address account, uint256 amount) public onlyMinter returns (bool){
        _mint(account, amount);
        return true;
    }
}

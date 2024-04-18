// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Context.sol";
import "./Roles.sol";
contract MinterRole is Context{
    using Roles for Roles.Role;

    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    Roles.Role private _minters;
    event Log(string str,address indexed message);
    constructor(){
        _addMinter(_msgSender());
        emit Log("constructor",_msgSender());
    }

    modifier onlyMinter(){
        require(isMinter(_msgSender()),"MinterRolew: caller does not have the Minter role");
        _;
    }
    function AddMinter(address account) public onlyMinter{
        emit Log("AddMinter",account);
        _addMinter(account);
    }
    function isMinter(address account) public view returns(bool){
        return _minters.has(account);
    }

    function renounceMinter()public{
        _removeMinter(_msgSender());
    }

    function _addMinter(address account)internal{
        _minters.add(account);
        emit MinterAdded(account);
    }

    function _removeMinter(address account) internal{
        _minters.remove(account);
        emit MinterRemoved(account);
    }
}
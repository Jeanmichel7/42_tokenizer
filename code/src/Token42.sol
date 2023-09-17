// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract Token42 is ERC20, Ownable {

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 42000 * (10 ** uint(decimals())));
    }

    function createOneToken() public payable {
        require(msg.value == 0.0001 ether, "0.0001 ether is required");
        _mint(msg.sender, 10 ** uint(decimals() - 4));
    }

    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
}
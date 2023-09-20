// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
// import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract Token42 is ERC20, Ownable {

    uint256 public constant RATE = 1000;

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(address(this), 42 * 1000000 * (10 ** uint(decimals())));
    }

    /**
     * @dev Function to mint tokens
     * @return A uint that indicates if the operation was successful.
     */

    function exchangeTokens() public payable returns (uint256) {
        require(msg.value > 0, "At least a small amount of ether is required");

        uint256 contractBalance = balanceOf(address(this));
        require(contractBalance > 0, "No tokens left in pool");

        uint256 initialBalance = 42 * 1000000 * (10 ** uint(decimals()));
        uint256 baseRate = 1000;
        uint256 ratioTokenInPool = initialBalance / contractBalance;
        uint256 tokensToExchange = msg.value * (baseRate / ratioTokenInPool);
    
        require(contractBalance >= tokensToExchange, "Not enough tokens in pool");
    
        _transfer(address(this), msg.sender, tokensToExchange);
        return tokensToExchange;
    }

    function transferTokensFromContract(address to, uint256 amount) public onlyOwner {
        uint256 contractBalance = balanceOf(address(this));
        require(contractBalance >= amount, "Not enough tokens in contract");
        
        _transfer(address(this), to, amount);
    }
}
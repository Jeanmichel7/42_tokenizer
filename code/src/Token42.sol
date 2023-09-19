// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract Token42 is ERC20, Ownable, AccessControl {

    uint256 public constant RATE = 1000;

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 42000 * (10 ** uint(decimals())));
    }

    /**
     * @dev Creates 1 new tokens for `to`.
     *
     * See {ERC20-_mint}.
     */
    function createOneToken() public payable {
        require(msg.value == 0.0001 ether, "0.0001 ether is required");
        _mint(msg.sender, 10 ** uint(decimals()));
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     *
     * See {ERC20-_mint}.
     */
    function buyTokens() public payable {
        require(msg.value > 0, "At least a small amount of ether is required");

        uint256 tokensToMint = msg.value * 1000;
        _mint(msg.sender, tokensToMint);
    }

    /**
     * @dev Returns the balance of the account.
     */
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
}
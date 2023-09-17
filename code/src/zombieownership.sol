// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ERC721 } from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "./zombieattack.sol";
import "./Token42.sol";

contract ZombieOwnership is ZombieAttack, ERC721 {
  mapping (uint => address) zombieApprovals;
  
  Token42 private token;

  constructor(address tokenAddress) ZombieAttack(tokenAddress) ERC721("ZombieTokenCollectopm", "ZMBC") {
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Ownable } from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract ZombieFactory is Ownable {
  event NewZombie(uint zombieId, string name, uint dna);

  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;
  uint cooldownTime = 5 minutes;

  struct Zombie {
    string  name;
    uint    dna;
    uint32  level;
    uint32  readyTime;
    uint16  winCount;
    uint16  lossCount;
    bool    isMint;
  }

  Zombie[] public zombies;

  mapping (uint => address) public zombieToOwner;
  mapping (address => uint) ownerZombieCount;

  function _createZombie(string memory _name, uint _dna) internal {
    zombies.push(
      Zombie(
        _name,
        _dna,
        1,
        uint32(block.timestamp + cooldownTime),
        0,
        0,
        false
      )
    );
    uint zombieId = zombies.length -1;
    zombieToOwner[zombieId] = msg.sender;
    ownerZombieCount[msg.sender]++;
    emit NewZombie(zombieId, _name, _dna);
  }

  function _generateRandomDna(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }

  function createRandomZombie(string memory _name) public {
    require(ownerZombieCount[msg.sender] < 2, "You can only have two zombies");
    
    uint randDna = _generateRandomDna(_name);
    randDna = randDna - randDna % 100;
    _createZombie(_name, randDna);
  }

}

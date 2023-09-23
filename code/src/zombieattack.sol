// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./zombiehelper.sol";

contract ZombieAttack is ZombieHelper {
  event AttackResult(bool isWin);

  uint randNonce = 0;
  uint attackVictoryProbability = 30;

  constructor(address tokenAddress) ZombieHelper(tokenAddress){
  }

  function randMod(uint _modulus) internal returns(uint) {
    randNonce++;
    return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus;
  }

  function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) returns (bool) {
    Zombie storage myZombie = zombies[_zombieId];
    Zombie storage enemyZombie = zombies[_targetId];
    uint rand = randMod(100);
    bool isWin = rand <= attackVictoryProbability + myZombie.level;
    if (isWin) {
      myZombie.winCount++;
      myZombie.level++;
      enemyZombie.lossCount++;
      feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
    } else {
      myZombie.lossCount++;
      enemyZombie.winCount++;
      _triggerCooldown(myZombie);
    }
    emit AttackResult(isWin);
    return isWin;
  }
}

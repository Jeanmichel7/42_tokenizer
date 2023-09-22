// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./zombiefeeding.sol";
import "./Token42.sol";

contract ZombieHelper is ZombieFeeding {

  uint changeNameFee = 10 ** 17;
  uint levelUpFee = 10 ** 18;
  uint changeDnaFee = 10 ** 19;
  Token42 private token;

  constructor(address tokenAddress) {
    token = Token42(tokenAddress);
  }

  function getToken42Balance(address userAddress) public view returns(uint) {
    return token.balanceOf(userAddress);
  }

  function getUserBalance(address userAddress) public view returns (uint256) {
    return token.balanceOf(userAddress);
  }

  function setToken42Address(address tokenAddress) external onlyOwner {
    token = Token42(tokenAddress);
  }


  modifier aboveLevel(uint _level, uint _zombieId) {
    require(zombies[_zombieId].level >= _level);
    _;
  }

  function withdraw() external onlyOwner {
    address payable _owner = payable(owner());
    _owner.transfer(address(this).balance);
  }

  function setLevelUpFee(uint _fee) external onlyOwner {
    levelUpFee = _fee;
  }

  function levelUp(uint _zombieId) external {
    require(zombies[_zombieId].level < 50, "Level max reached");
    require(
      token.allowance(msg.sender, address(this)) >= levelUpFee,
      "Token allowance not sufficient"
    );

    require(
      token.transferFrom(msg.sender, address(this), levelUpFee),
      "Token transfer failed"
    );
    zombies[_zombieId].level++;
  }

  function changeName(uint _zombieId, string memory _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
    require(
      token.allowance(msg.sender, address(this)) >= changeNameFee,
      "Token allowance not sufficient"
    );

    require(
      token.transferFrom(msg.sender, address(this), changeNameFee),
      "Token transfer failed"
    );
    zombies[_zombieId].name = _newName;
  }

  function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
    require(
      token.allowance(msg.sender, address(this)) >= changeDnaFee,
      "Token allowance not sufficient"
    );

    require(
      token.transferFrom(msg.sender, address(this), changeDnaFee),
      "Token transfer failed"
    );
    zombies[_zombieId].dna = _newDna;
  }

  function getZombiesByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerZombieCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < zombies.length; i++) {
      if (zombieToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  /**
   * @dev Return 5 random zombies not to owner
   * @param _owner address of owner
   */

  function getRandomZombiesTarget(address _owner) external view returns(uint[] memory) {
    require(zombies.length > 0, "No zombies found");

    uint maxLength = 5;
    uint[] memory result = new uint[](maxLength);
    uint count = 0;
    uint attempts = 0;

    uint[] memory seenZombies = new uint[](zombies.length);
    uint seenCount = 0;

    while (count < maxLength && attempts < zombies.length * 2) {
      uint rand = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, attempts))) % zombies.length;
      bool isSeen = false;

      /* check already in seenZombies */
      for (uint i = 0; i < seenCount; i++) {
        if (seenZombies[i] == rand) {
            isSeen = true;
            break;
        }
      }

      /* check zombie is not to owner */
      if (!isSeen && zombieToOwner[rand] != _owner) {
        result[count] = rand;
        seenZombies[seenCount] = rand;
        seenCount++;
        count++;
      }

      attempts++;
    }

    // Redimensionner le tableau de sortie si moins de 5 zombies sont trouvés
    if (count < maxLength) {
        uint[] memory resizedResult = new uint[](count);
        for (uint i = 0; i < count; i++) {
            resizedResult[i] = result[i];
        }
        return resizedResult;
    }

    return result;
  }

}

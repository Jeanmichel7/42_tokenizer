// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ERC721 } from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "./zombieattack.sol";
import "./Token42.sol";

contract ZombieOwnership is ZombieAttack, ERC721 {

    mapping (uint => address) zombieApprovals;
    Token42 private token;

    constructor(address tokenAddress) ZombieAttack(tokenAddress) ERC721("ZombieNFT", "ZMBC") {
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        return ownerZombieCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view override returns (address) {
        return zombieToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal override {
        ownerZombieCount[_to]++;
        ownerZombieCount[msg.sender]--;
        zombieToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public override {
        require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) public override onlyOwnerOf(_tokenId) {
        zombieApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function reactToCustomEvent(uint256 data) public {
        _safeMint(msg.sender, data);
    }

}

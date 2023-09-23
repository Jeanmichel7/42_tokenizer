// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

/**
 * @title Token42
 * @dev This contract implements a basic ERC20 token with multi-signature capabilities.
 */
contract Token42 is ERC20, AccessControl {

    uint128 public constant RATE = 1000;
    uint128 public requiredSignatures;
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    address[] public owners;
    mapping(address => bool) public isOwner;

    struct TransferRequest {
        bool isEth;
        address to;
        uint256 amount;
        uint256 approvals;
        bool executed;
    }

    TransferRequest[] public transferRequests;
    mapping(uint256 => mapping(address => bool)) public approvals;

    /**
     * @dev Ensures the caller is an owner of the contract.
     */
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    /**
     * @dev Constructor that initializes the ERC20 token and sets the initial multi-signature owners.
     * @param name The name of the ERC20 token.
     * @param symbol The symbol of the ERC20 token.
     * @param _owners Array of initial owners for the multi-signature functionalities.
     * @param _requiredSignatures Number of signatures required for a transfer to be approved.
     */
    constructor(
        string memory name, 
        string memory symbol, 
        address[] memory _owners, 
        uint128 _requiredSignatures
    ) ERC20(name, symbol) {
        _mint(address(this), 42 * 1000000 * (10 ** uint(decimals())));
        
        for(uint i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
            _grantRole(DEFAULT_ADMIN_ROLE, _owners[i]);
            _grantRole(MINT_ROLE, _owners[i]);
            _grantRole(BURNER_ROLE, _owners[i]);
        }
        owners = _owners;
        requiredSignatures = _requiredSignatures;
    }

    /**
     * @dev Proposes a new transfer. The proposer automatically approves the transfer.
     * @param to The recipient's address.
     * @param amount The amount of tokens to be transferred  in decimal
     * @return The ID of the proposed transfer. This can be used for future reference and approvals.
     */
    function proposeTransfer(address to, uint256 amount, bool isEth) public onlyOwner returns (uint256) {
        TransferRequest memory newRequest = TransferRequest({
            isEth: isEth,
            to: to,
            amount: amount,
            approvals: 1,
            executed: false
        });
        
        transferRequests.push(newRequest);
        uint256 transferId = transferRequests.length - 1;
        approvals[transferId][msg.sender] = true;
        return transferId;
    }


    /**
     * @dev Approves a previously proposed transfer. If enough approvals are collected, the transfer is executed.
     * @param transferId The ID of the transfer to be approved, as returned by proposeTransfer.
     */
    function approveTransfer(uint256 transferId) public onlyOwner{
        require(!approvals[transferId][msg.sender], "Already approved");
        require(!transferRequests[transferId].executed, "Transfer already executed");
        
        approvals[transferId][msg.sender] = true;
        transferRequests[transferId].approvals += 1;

        if(transferRequests[transferId].approvals == requiredSignatures) {
            uint256 amount = transferRequests[transferId].amount;
            address to = transferRequests[transferId].to;
            transferRequests[transferId].executed = true;

            if (transferRequests[transferId].isEth) {
                require(address(this).balance >= amount, "Not enough ETH in contract");
                payable(to).transfer(amount);
            } else {
                _transfer(address(this), to, amount);
            }
        }
    }

    /**
     * @dev Allows users to exchange ether for tokens based on a predefined rate. The rate may vary depending on the available token balance.
     * @return The number of tokens exchanged.
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


    /**
     * @dev Returns the number of transfer requests.
     * @return The number of transfer requests.
     */
    function transferRequestCount() public view returns (uint256) {
        return transferRequests.length;
    }

    /**
     * @dev mint new tokens
     * @param to address to mint to
     * @param amount amount to mint
     * @notice Only addresses with the MINT_ROLE can call this function
     */
    function mint(address to, uint256 amount) public onlyRole(MINT_ROLE) {
        _mint(to, amount);
    }

    /**
     * @dev burn tokens
     * @param from address to burn from
     * @param amount amount to burn
     * @notice Only addresses with the BURNER_ROLE can call this function
     */
    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

}
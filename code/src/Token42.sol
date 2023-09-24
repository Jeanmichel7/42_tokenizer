// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";
import {Governor} from "openzeppelin-contracts/contracts/governance/Governor.sol";
import {GovernorSettings} from "openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "openzeppelin-contracts/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "openzeppelin-contracts/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {GovernorTimelockControl} from "openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol";
import {ERC20Votes} from "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {TimelockController} from "openzeppelin-contracts/contracts/governance/TimelockController.sol";
import {IGovernor} from "openzeppelin-contracts/contracts/governance/IGovernor.sol";

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

    struct ProposalTransfer {
        bool isEth;
        address to;
        uint256 amount;
        uint256 approvals;
        bool executed;
    }
    ProposalTransfer[] public proposalTransfers;
    mapping(uint256 => mapping(address => bool)) public approvals;

    struct ProposalVote {
        string description;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
    }
    ProposalVote[] public proposalsVote;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

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
    )
        ERC20(name, symbol) 
    {
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
     * @dev Proposes a new transfer. The proposer automatically approves the transfer.
     * @param to The recipient's address.
     * @param amount The amount of tokens to be transferred  in decimal
     * @return The ID of the proposed transfer. This can be used for future reference and approvals.
     */
    function proposeTransfer(address to, uint256 amount, bool isEth) public onlyOwner returns (uint256) {
        ProposalTransfer memory newRequest = ProposalTransfer({
            isEth: isEth,
            to: to,
            amount: amount,
            approvals: 1,
            executed: false
        });
        
        proposalTransfers.push(newRequest);
        uint256 transferId = proposalTransfers.length - 1;
        approvals[transferId][msg.sender] = true;
        return transferId;
    }


    /**
     * @dev Approves a previously proposed transfer. If enough approvals are collected, the transfer is executed.
     * @param transferId The ID of the transfer to be approved, as returned by proposeTransfer.
     */
    function approveTransfer(uint256 transferId) public onlyOwner{
        require(!approvals[transferId][msg.sender], "Already approved");
        require(!proposalTransfers[transferId].executed, "Transfer already executed");
        
        approvals[transferId][msg.sender] = true;
        proposalTransfers[transferId].approvals += 1;

        if(proposalTransfers[transferId].approvals == requiredSignatures) {
            uint256 amount = proposalTransfers[transferId].amount;
            address to = proposalTransfers[transferId].to;
            proposalTransfers[transferId].executed = true;

            if (proposalTransfers[transferId].isEth) {
                require(address(this).balance >= amount, "Not enough ETH in contract");
                payable(to).transfer(amount);
            } else {
                _transfer(address(this), to, amount);
            }
        }
    }

    /**
     * @return The number of transfer requests.
     */
    function proposeTransferCount() public view returns (uint256) {
        return proposalTransfers.length;
    }

    /**
     * @dev Proposes a new vote. The proposer automatically votes for the proposal.
     * @param description The description of the proposal.
     * @param duration The duration of the vote in miliseconds.
     * @return The ID of the proposed vote. This can be used for future reference and approvals.
     */
    function proposalVote(string memory description, uint256 duration) external returns (uint256) {
        require(duration > 600000, "Duration must be greater than 10min");
        require(msg.sender != address(0), "Zero address");
        require(bytes(description).length > 0, "Empty description");
        require(balanceOf(msg.sender) >= 1e18, "Need at lease one tokens");

        proposalsVote.push(ProposalVote({
            description: description,
            endTime: block.timestamp + duration,
            forVotes: 0,
            againstVotes: 0,
            executed: false
        }));

        uint256 proposalId = proposalsVote.length - 1;
        return proposalId;
    }


    /**
     * @dev vote for a proposal
     * @param proposalId The ID of the proposal to be voted, as returned by proposalVote.
     * @param support True if the caller supports the proposal, false otherwise.
     * @notice The caller must have at least 1 token to vote
     * @notice The caller can only vote once
     * @notice The caller can only vote if the voting period has not ended
     * @notice The caller can only vote for one proposal at a time
     */
    function vote(uint256 proposalId, bool support) external {
        require(proposalId < proposalsVote.length, "Proposal not found");
        require(!proposalsVote[proposalId].executed, "Proposal already executed");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(block.timestamp < proposalsVote[proposalId].endTime, "Voting period has ended");
        require(balanceOf(msg.sender) >= 1e18, "Need at lease one tokens");
    
        hasVoted[proposalId][msg.sender] = true;
        uint256 votes = balanceOf(msg.sender);
        if (support) {
            proposalsVote[proposalId].forVotes += votes / 1e18;
        } else {
            proposalsVote[proposalId].againstVotes += votes / 1e18;
        }
    }


    /**
     * @return The number vote proposals.
     */
    function proposalVoteCount() external view returns (uint256) {
        return proposalsVote.length;
    }

}

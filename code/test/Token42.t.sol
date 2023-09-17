// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Token42} from "../src/Token42.sol";

contract Token42Test is Test {
    Token42 public contractToTest;

    // function setUp() public {
    //     contractToTest = new Token42("TESTER", "TST");
    //     // counter.setNumber(0);
    // }

    // function test_Increment() public {
    //     contractToTest.mintTo(0x6b7bE2f9C117628fdc44B7d52033A880E27BEba5);
    //     // assertEq(contractToTest.number(), 1);
    // }

    // function testFuzz_SetNumber(uint256 x) public {
    //     contractToTest.tokenURI(x);
    //     // assertEq(contractToTest.number(), x);
    // }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Hello_World {
    string greet = "Hello World!";

    function sayHello() public view returns (string memory) {
        return greet;
    }
}

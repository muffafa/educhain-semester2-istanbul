//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MyCounter {
uint256 currentCount = 0;

    function increment() public {
        currentCount = currentCount + 1;
    }

    function retrieve() public view returns (uint256){
        return currentCount;
    }
}
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract Storage {
    DataStorage[] public data;

    address payable[] contractPartners = [
        payable(0xE4b3717A2b902327BCe7473F68A996Ea0860397F),
        payable(0xB9fe0Ff0fC8CB73Be7A887e8319bA7AC7dD8ecEC)
    ];

    struct DataStorage {
        uint256 timeStamps;
        string data;
    }

    function getArr() public view returns (DataStorage[] memory) {
        return data;
    }

    uint256 public timestamp;

    function store(string memory iotData) public returns (bool) {
        timestamp = block.timestamp;
        data.push(DataStorage(timestamp, iotData));
        return true;
    }

    function transfer() public payable returns (bool) {
        if (msg.sender == contractPartners[0]) {
            contractPartners[1].transfer(msg.value);
            return true;
        } else if (msg.sender == contractPartners[1]) {
            contractPartners[0].transfer(msg.value);
            return true;
        }

        return false;
    }
}

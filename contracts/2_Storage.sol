// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract Storage {
    string[] public data;

    address payable[] contractPartners = [
        payable(0x157EF7ADDc804397CB5966dbCc003e163a473D0c),
        payable(0xB9fe0Ff0fC8CB73Be7A887e8319bA7AC7dD8ecEC)
    ];

    function getArr() public view returns (string[] memory) {
        return data;
    }

    function store(string memory iotData) public returns (bool) {
        data.push(iotData);
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

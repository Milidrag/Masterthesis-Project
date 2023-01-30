// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.7;

contract Storage {
    DataStorage[] public data;

    address[] contractPartners = [
        0x157EF7ADDc804397CB5966dbCc003e163a473D0c,
        0xe38DFE9cA9f8e23BE8dA01cDDfF741ae3fFa2DEc
    ];

    struct DataStorage {
        uint256 timeStamps;
        string data;
    }

    uint256 public timestamp;

    function store(string memory iotData, uint256 amount) public {
        timestamp = block.timestamp;
        data.push(DataStorage(timestamp, iotData));
        _transfer(amount);
    }

    function _transfer(uint256 amount) public returns (bool) {
        address owner = msg.sender;

        if (msg.sender == contractPartners[0]) {
            _transfer(owner, contractPartners[1], amount);
            return true;
        } else if (msg.sender == contractPartners[1]) {
            _transfer(owner, contractPartners[0], amount);
            return true;
        }

        return false;
    }
}

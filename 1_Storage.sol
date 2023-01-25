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

    function store(string memory iotData) public {
        timestamp = block.timestamp;
        data.push(DataStorage(timestamp, iotData));
        transfer();
    }

    function transfer() private view {
        if (msg.sender == contractPartners[0]) {
            //  https://medium.com/coinmonks/solidity-transfer-vs-send-vs-call-function-64c92cfc878a
            //transfer a small amount of money to address[0]
        } else if (msg.sender == contractPartners[1]) {
            //transfer a small amount of money to address[1]
        }
    }

    //TODO noch die 2 Adressen hineinspeichern einbauen
    //TODO einbauchen, dass bei jeder Messung eine Überweisung stattfindet
}

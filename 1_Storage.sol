contract Storage {
    DataStorage[] public data;

    address payable[] contractPartners = [
        payable(0x157EF7ADDc804397CB5966dbCc003e163a473D0c),
        payable(0xe38DFE9cA9f8e23BE8dA01cDDfF741ae3fFa2DEc)
    ];

    struct DataStorage {
        uint256 timeStamps;
        string data;
    }

    uint256 public timestamp;

    function store(string memory iotData, uint256 amount) public {
        timestamp = block.timestamp;
        data.push(DataStorage(timestamp, iotData));
        transfer(amount);
    }

    function transfer(uint256 amount) public returns (bool) {
        if (msg.sender == contractPartners[0]) {
            contractPartners[1].transfer(amount);
            return true;
        } else if (msg.sender == contractPartners[1]) {
            contractPartners[0].transfer(amount);
            return true;
        }

        return false;
    }
}

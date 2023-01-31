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

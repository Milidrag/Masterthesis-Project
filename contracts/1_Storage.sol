// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract Storage {
    string private ipfsHash;

    address payable[] contractPartners = [
        payable(0x31A14E0B72BA801a354a2Dc5a7EB88Ee0bf9fD70),
        payable(0x7FfD093575F930DA470B3D601d0CB823C44bB37a)
    ];

    function setHash(string memory x) public {
        ipfsHash = x;
    }

    function getHash() public view returns (string memory) {
        return ipfsHash;
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

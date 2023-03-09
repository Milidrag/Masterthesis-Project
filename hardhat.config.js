require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  networks: {
    matic_testnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: ["0xe1ec520d880d5f95b17e97fcfd56ed9a77ecca3c455a9bcaca72ab8543483537"],
      gasPrice: 8000000000
    }
  }
};

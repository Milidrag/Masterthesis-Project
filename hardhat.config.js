require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { PRIVATE_KEY_ALICE } = process.env

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "shimmerTest",
  networks: {
    shimmerTest: {
      url: "https://json-rpc.evm.testnet.shimmer.network",
      accounts: [PRIVATE_KEY_ALICE],
      timeout: 60000
    }
  }
};

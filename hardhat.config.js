require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter")


const { PRIVATE_KEY_ALICE, COINMARKET } = process.env

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "shimmerTest",
  networks: {
    shimmerTest: {
      url: "https://json-rpc.evm.testnet.shimmer.network",
      accounts: [PRIVATE_KEY_ALICE],
      timeout: 60000
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKET
  }
};

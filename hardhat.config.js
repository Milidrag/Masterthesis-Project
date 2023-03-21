require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter")


const { PRIVATE_KEY_GOERLI_ALICE, PROVIDER_ALCHEMY_POLYGON, COINMARKET, ETHEREUM_EXPLORER_API_KEY } = process.env


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: PROVIDER_ALCHEMY_POLYGON,
      accounts: [PRIVATE_KEY_GOERLI_ALICE],
      chainID: 80001
    }
  },
  etherscan: {
    apiKey: ETHEREUM_EXPLORER_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKET,
    token: "MATIC"
  }
};
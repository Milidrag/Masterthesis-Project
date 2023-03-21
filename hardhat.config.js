require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter")


const { PRIVATE_KEY_GOERLI_ALICE, PROVIDER_ALCHEMY, COINMARKET, ETHEREUM_EXPLORER_API_KEY, PROVIDER_ALCHEMY_SEPOLIA } = process.env


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "sepolia",
  networks: {
    goerli: {
      url: PROVIDER_ALCHEMY,
      accounts: [PRIVATE_KEY_GOERLI_ALICE],
      chainID: 5
    },
    sepolia: {
      url: PROVIDER_ALCHEMY_SEPOLIA,
      accounts: [PRIVATE_KEY_GOERLI_ALICE],
      chainId: 11155111,
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
    coinmarketcap: COINMARKET
  }
};